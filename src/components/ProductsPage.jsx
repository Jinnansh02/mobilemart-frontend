// src/components/shop/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Text,
  Heading,
  Button,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  VStack,
  Badge,
  Image,
  Skeleton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  InputRightElement,
  IconButton,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FiFilter, FiX, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { apiClient } from '../utils/apiClient.js';
import Layout from './Layout.jsx';
import { useNavigate } from 'react-router-dom';

// Wrap Chakra components with motion
const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <MotionBox
      onClick={() => navigate(`/products/${product._id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg="white"
      rounded="lg"
      shadow="sm"
      overflow="hidden"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-4px)',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Box position="relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          //   height="200px"
          width="100%"
          objectFit="cover"
        />
        {!product.isActive && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="red"
            rounded="full"
            px={2}
          >
            Out of Stock
          </Badge>
        )}
      </Box>
      <Box p={4}>
        <VStack align="start" spacing={2}>
          <Badge colorScheme="blue" rounded="full">
            {product.category.title}
          </Badge>
          <Heading size="md" noOfLines={2}>
            {product.name}
          </Heading>
          <Text color="gray.600" fontSize="sm" noOfLines={2}>
            {product.description}
          </Text>
          <HStack justifyContent="space-between" width="100%">
            <Text fontWeight="bold" fontSize="xl" color="blue.600">
              ${product.price.toFixed(2)}
            </Text>
            <Badge
              colorScheme={product.stock > 0 ? 'green' : 'red'}
              variant="subtle"
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </HStack>
          <Button
            colorScheme="blue"
            width="100%"
            isDisabled={!product.isActive || product.stock === 0}
          >
            Add to Cart
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
};

const ProductsPage = () => {
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    sortBy: 'name',
    sortOrder: 'desc',
  });

  // Responsive drawer
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          apiClient.get('/api/products'),
          apiClient.get('/api/categories'),
        ]);
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category
      ? product.category._id === filters.category
      : true;
    const matchesPrice =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;
    const matchesStock = filters.inStock ? product.stock > 0 : true;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    switch (filters.sortBy) {
      case 'price':
        return (a.price - b.price) * order;
      case 'name':
        return a.name.localeCompare(b.name) * order;
      default:
        return 0;
    }
  });

  const FilterContent = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontWeight="medium" mb={2}>
          Category
        </Text>
        <Select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          placeholder="All Categories"
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <Text fontWeight="medium" mb={2}>
          Price Range
        </Text>
        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={([min, max]) =>
            setFilters({ ...filters, minPrice: min, maxPrice: max })
          }
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <HStack justifyContent="space-between" mt={2}>
          <Text fontSize="sm">${filters.minPrice}</Text>
          <Text fontSize="sm">${filters.maxPrice}</Text>
        </HStack>
      </Box>

      <Box>
        <Text fontWeight="medium" mb={2}>
          Sort By
        </Text>
        <Select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
        </Select>
      </Box>

      <Button
        colorScheme="blue"
        variant="outline"
        onClick={() =>
          setFilters({
            search: '',
            category: '',
            minPrice: 0,
            maxPrice: 1000,
            inStock: false,
            sortBy: 'name',
            sortOrder: 'asc',
          })
        }
      >
        Reset Filters
      </Button>
    </VStack>
  );

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        {/* Main Content */}
        <Flex>
          {/* Desktop Filters */}
          {!isMobile && (
            <Box w="250px" mr={8}>
              <FilterContent />
            </Box>
          )}

          {/* Products Grid */}
          <Box flex={1}>
            {/* Header and Search */}
            <Box mb={8}>
              {/* <Heading mb={4}>Our Products</Heading> */}
              <HStack spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                  {filters.search && (
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        icon={<FiX />}
                        variant="ghost"
                        onClick={() => setFilters({ ...filters, search: '' })}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                {isMobile && (
                  <IconButton
                    icon={<FiFilter />}
                    onClick={onOpen}
                    variant="outline"
                  />
                )}
                <Tooltip label="Toggle Sort Order">
                  <IconButton
                    icon={
                      filters.sortOrder === 'asc' ? (
                        <FiArrowUp />
                      ) : (
                        <FiArrowDown />
                      )
                    }
                    onClick={() =>
                      setFilters({
                        ...filters,
                        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                      })
                    }
                    variant="outline"
                  />
                </Tooltip>
              </HStack>
            </Box>

            {isLoading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[...Array(6)].map((_, i) => (
                  <Box key={i}>
                    <Skeleton height="200px" mb={4} />
                    <Skeleton height="20px" mb={2} />
                    <Skeleton height="20px" width="60%" />
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <MotionSimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </MotionSimpleGrid>
            )}

            {!isLoading && sortedProducts.length === 0 && (
              <Box textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.600">
                  No products found matching your criteria
                </Text>
              </Box>
            )}
          </Box>
        </Flex>

        {/* Mobile Filters Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filters</DrawerHeader>
            <DrawerBody>
              <FilterContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
    </Layout>
  );
};

export default ProductsPage;
