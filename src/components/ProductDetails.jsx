// src/components/shop/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Image,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Skeleton,
  useToast,
  IconButton,
  List,
  ListItem,
  ListIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  AspectRatio,
} from '@chakra-ui/react';
import { ChevronRightIcon, CheckIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { addToCart } from '../store/authSlice';
import { apiClient } from '../utils/apiClient';
import Layout from './Layout';

const MotionBox = motion(Box);

const RelatedProducts = ({ products, currentProductId }) => {
  const navigate = useNavigate();

  return (
    <Box py={8}>
      <Box mb={6}>
        <Heading size="lg">Related Products</Heading>
        <Text color="gray.600" mt={2}>
          Products you might also like
        </Text>
      </Box>

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={6}
      >
        {products.slice(0, 4).map((product) => (
          <MotionBox
            key={product._id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            cursor="pointer"
            onClick={() => navigate(`/products/${product._id}`)}
            bg="white"
            rounded="lg"
            shadow="sm"
            overflow="hidden"
            borderWidth="1px"
          >
            <AspectRatio ratio={1}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                objectFit="cover"
              />
            </AspectRatio>
            <Box p={4}>
              <VStack align="start" spacing={2}>
                <Badge colorScheme="blue" rounded="full">
                  {product.category.title}
                </Badge>
                <Heading size="sm" noOfLines={2}>
                  {product.name}
                </Heading>
                <HStack justify="space-between" width="100%">
                  <Text color="blue.600" fontWeight="bold">
                    ${product.price.toFixed(2)}
                  </Text>
                  <Badge
                    colorScheme={product.stock > 0 ? 'green' : 'red'}
                    variant="subtle"
                  >
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </Grid>
    </Box>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Get auth and cart state from Redux
  const { isAuthenticated, cart } = useSelector((state) => state.auth);

  // Check if product is already in cart
  const isInCart = cart.some((item) => item.id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const [productResponse, favoriteResponse] = await Promise.all([
          apiClient.get(`/api/products/${id}`),
          isAuthenticated
            ? apiClient.get('/api/favorites')
            : Promise.resolve({ data: { favorite: { products: [] } } }),
        ]);

        setProduct(productResponse.data.data);

        // Check if product is in favorites
        if (isAuthenticated) {
          const favoriteProducts = favoriteResponse.data.favorite.products;
          setIsFavorite(favoriteProducts.some((p) => p._id === id));
        }

        // Fetch related products from same category
        const relatedResponse = await apiClient.get(
          `/api/products?category=${productResponse.data.data.category._id}&limit=10`
        );
        setRelatedProducts(
          relatedResponse.data.data.filter((p) => p._id !== id)
        );
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch product details',
          status: 'error',
          duration: 3000,
        });
        // navigate('/products');
        console.log(error?.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate, toast, isAuthenticated]);

  const handleToggleFavorite = async () => {
    try {
      if (!isAuthenticated) {
        toast({
          title: 'Please login',
          description: 'You need to login to manage favorites',
          status: 'warning',
          duration: 2000,
        });
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
        return;
      }

      setIsTogglingFavorite(true);

      if (isFavorite) {
        // Remove from favorites
        await apiClient.delete(`/api/favorites/remove/${id}`);
        toast({
          title: 'Removed from favorites',
          description: 'Product removed from your favorites',
          status: 'success',
          duration: 2000,
        });
      } else {
        // Add to favorites
        await apiClient.post('/api/favorites/add', { productId: id });
        toast({
          title: 'Added to favorites',
          description: 'Product added to your favorites',
          status: 'success',
          duration: 2000,
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${
          isFavorite ? 'remove from' : 'add to'
        } favorites`,
        status: 'error',
        duration: 2000,
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        toast({
          title: 'Please login',
          description: 'You need to login to add items to cart',
          status: 'warning',
          duration: 2000,
        });
        // Save current URL to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
        return;
      }

      setIsAddingToCart(true);

      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity,
          stock: product.stock,
          sku: product.sku,
        })
      );

      toast({
        title: 'Added to cart',
        description: `${quantity} ${product.name} added to cart`,
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        status: 'error',
        duration: 2000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
            <Skeleton height="500px" />
            <VStack align="stretch" spacing={4}>
              <Skeleton height="40px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" width="60%" />
              <Skeleton height="100px" />
            </VStack>
          </Grid>
        </Container>
      </Layout>
    );
  }

  if (!product) return null;

  return (
    <Layout>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container maxW="container.lg" py={8}>
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            mb={8}
          >
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/products')}>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Product Details */}
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
            {/* Product Image */}
            <Box>
              <AspectRatio ratio={1}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  objectFit="cover"
                  rounded="lg"
                />
              </AspectRatio>
            </Box>

            {/* Product Info */}
            <VStack align="stretch" spacing={6}>
              <Box>
                <Badge colorScheme="blue" mb={2}>
                  {product.category.title}
                </Badge>
                <Heading size="xl" mb={2}>
                  {product.name}
                </Heading>
                <Text fontSize="2xl" color="blue.600" fontWeight="bold">
                  ${product.price.toFixed(2)}
                </Text>
              </Box>

              <Text color="gray.600">{product.description}</Text>

              <Divider />

              {/* Stock Status */}
              <Box>
                <Badge
                  colorScheme={product.stock > 0 ? 'green' : 'red'}
                  fontSize="sm"
                  px={2}
                  py={1}
                >
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
                {product.stock > 0 && (
                  <Text color="gray.600" mt={2}>
                    {product.stock} units available
                  </Text>
                )}
              </Box>

              {/* Product Features */}
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  Authentic Product
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  Free Shipping Available
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  Secure Payment
                </ListItem>
              </List>

              {/* Quantity and Add to Cart */}
              <HStack spacing={4}>
                <NumberInput
                  value={quantity}
                  min={1}
                  max={product.stock}
                  onChange={(value) => setQuantity(parseInt(value))}
                  width="120px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                {isInCart ? (
                  <Button
                    leftIcon={<FiShoppingCart />}
                    colorScheme="green"
                    size="lg"
                    onClick={handleGoToCart}
                    flex={1}
                  >
                    Go to Cart
                  </Button>
                ) : (
                  <Button
                    leftIcon={<FiShoppingCart />}
                    colorScheme="blue"
                    size="lg"
                    onClick={handleAddToCart}
                    isLoading={isAddingToCart}
                    isDisabled={!product.isActive || product.stock === 0}
                    loadingText="Adding to Cart"
                    flex={1}
                  >
                    Add to Cart
                  </Button>
                )}

                <IconButton
                  icon={<FiHeart />}
                  variant={isFavorite ? 'solid' : 'outline'}
                  colorScheme={isFavorite ? 'red' : 'blue'}
                  size="lg"
                  aria-label={
                    isFavorite ? 'Remove from favorites' : 'Add to favorites'
                  }
                  onClick={handleToggleFavorite}
                  isLoading={isTogglingFavorite}
                  _hover={{
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s',
                  }}
                />

                {/* <IconButton
                  icon={<FiHeart />}
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  aria-label="Add to wishlist"
                /> */}
              </HStack>

              {/* SKU */}
              <Text color="gray.500" fontSize="sm">
                SKU: {product.sku}
              </Text>
            </VStack>
          </Grid>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts
              products={relatedProducts}
              currentProductId={product._id}
            />
          )}
        </Container>
      </MotionBox>
    </Layout>
  );
};

export default ProductDetails;
