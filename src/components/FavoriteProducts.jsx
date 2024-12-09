// src/components/shop/FavoriteProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  Badge,
  Skeleton,
  useToast,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { apiClient } from '../utils/apiClient';
import Layout from './Layout';

const MotionBox = motion(Box);

const FavoriteProducts = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/favorites');
      setFavorites(response.data.favorite.products || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch favorite products',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      setIsRemoving(true);
      await apiClient.delete(`/api/favorites/remove/${productId}`);

      setFavorites(favorites.filter((product) => product._id !== productId));
      onClose();

      toast({
        title: 'Removed from favorites',
        description: 'Product removed from your favorites',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove product from favorites',
        status: 'error',
        duration: 2000,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const openRemoveModal = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const LoadingSkeleton = () => (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      gap={6}
    >
      {[1, 2, 3, 4].map((i) => (
        <Box key={i}>
          <Skeleton height="200px" />
          <VStack align="stretch" mt={4} spacing={2}>
            <Skeleton height="20px" width="60%" />
            <Skeleton height="16px" width="40%" />
            <Skeleton height="32px" />
          </VStack>
        </Box>
      ))}
    </Grid>
  );

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <LoadingSkeleton />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        {/* Breadcrumb */}
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
          mb={8}
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Favorite Products</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Box mb={8}>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="xl">My Favorites</Heading>
              <Text color="gray.600">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* No favorites message */}
        {favorites.length === 0 && (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            borderRadius="lg"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              No Favorite Products
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              You haven't added any products to your favorites yet.
            </AlertDescription>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </Alert>
        )}

        {/* Products Grid */}
        {favorites.length > 0 && (
          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={6}
          >
            {favorites.map((product) => (
              <MotionBox
                key={product._id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                bg="white"
                rounded="lg"
                shadow="sm"
                overflow="hidden"
                borderWidth="1px"
              >
                <Box
                  position="relative"
                  cursor="pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    height="200px"
                    width="100%"
                    objectFit="cover"
                  />
                  <IconButton
                    icon={<FiTrash2 />}
                    colorScheme="red"
                    variant="solid"
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      openRemoveModal(product);
                    }}
                    _hover={{
                      transform: 'scale(1.1)',
                    }}
                  />
                </Box>

                <Box p={4}>
                  <VStack align="start" spacing={2}>
                    <Badge colorScheme="blue" rounded="full">
                      {product.category?.title}
                    </Badge>
                    <Heading size="sm" noOfLines={2}>
                      {product.name}
                    </Heading>
                    <Text color="gray.600" noOfLines={2}>
                      {product.description}
                    </Text>
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
        )}

        {/* Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Remove from Favorites</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to remove "{selectedProduct?.name}" from
              your favorites?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleRemoveFromFavorites(selectedProduct?._id)}
                isLoading={isRemoving}
              >
                Remove
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
};

export default FavoriteProducts;
