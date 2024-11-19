import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Badge,
  Avatar,
  Icon,
  useColorModeValue,
  Flex,
  Stack,
  chakra,
  Stat,
  StatNumber,
  StatLabel,
  Skeleton,
} from '@chakra-ui/react';
import { StarIcon, ShoppingBagIcon } from '@chakra-ui/icons';
import { FiShoppingBag, FiAward, FiTruck, FiHeadphones } from 'react-icons/fi';
import Layout from './Layout.jsx';
import { apiClient } from '../utils/apiClient.js';

const MotionBox = motion(Box);

// Custom review card component
const CustomerReview = ({ review }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      bg={cardBg}
      p={6}
      rounded="xl"
      shadow="md"
      transition="0.2s ease"
    >
      <VStack align="start" spacing={4}>
        <HStack spacing={4}>
          <Avatar size="md" name={review.name} src={review.avatar} />
          <Box>
            <Text fontWeight="bold">{review.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {review.date}
            </Text>
          </Box>
        </HStack>
        <HStack spacing={1}>
          {Array(5)
            .fill('')
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < review.rating ? 'yellow.400' : 'gray.300'}
              />
            ))}
        </HStack>
        <Text color="gray.600">{review.content}</Text>
        <Badge colorScheme="blue" rounded="full" px={3} py={1}>
          {review.productPurchased}
        </Badge>
      </VStack>
    </MotionBox>
  );
};

// Featured Product Card Component
const FeaturedProduct = ({ product }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionBox
      whileHover={{ y: -8 }}
      bg={cardBg}
      rounded="2xl"
      shadow="lg"
      overflow="hidden"
      transition="0.2s ease"
      onClick={() => navigate(`/products/${product._id}`)}
      cursor="pointer"
    >
      <Box position="relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          w="full"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={4}
          right={4}
          px={3}
          py={1}
          colorScheme="blue"
          rounded="full"
          fontSize="sm"
        >
          Featured
        </Badge>
        {!product.isActive && (
          <Badge
            position="absolute"
            top={4}
            left={4}
            colorScheme="red"
            rounded="full"
          >
            Out of Stock
          </Badge>
        )}
      </Box>
      <VStack p={6} align="stretch" spacing={3}>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="blue.500"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {product.category.title}
        </Text>
        <Heading size="lg">{product.name}</Heading>
        <Text color="gray.600" noOfLines={2}>
          {product.description}
        </Text>
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            ${product.price.toFixed(2)}
          </Text>
          <Badge colorScheme={product.stock > 0 ? 'green' : 'red'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
        </HStack>
        <Button
          colorScheme="blue"
          size="lg"
          isDisabled={!product.isActive || product.stock === 0}
          rightIcon={<FiShoppingBag />}
        >
          View Details
        </Button>
      </VStack>
    </MotionBox>
  );
};

// Feature highlight component
const FeatureCard = ({ icon, title, description }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <VStack
      bg={cardBg}
      p={8}
      rounded="xl"
      shadow="md"
      spacing={4}
      align="start"
    >
      <Box p={3} bg="blue.50" rounded="full" color="blue.500">
        <Icon as={icon} w={6} h={6} />
      </Box>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  );
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          apiClient.get('/api/products'),
          apiClient.get('/api/categories'),
        ]);

        // Sort products by price to get featured items
        const allProducts = productsRes.data.data;
        const featuredProducts = [...allProducts]
          .sort((a, b) => b.price - a.price)
          .slice(0, 3);

        setProducts(featuredProducts);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sample customer reviews
  const customerReviews = [
    {
      name: 'James Wilson',
      avatar: '/api/placeholder/48/48',
      date: 'March 25, 2024',
      rating: 5,
      content:
        'The iPhone 14 Pro Max exceeded all my expectations. The camera system is absolutely incredible, and the Dynamic Island is a game-changer!',
      productPurchased: 'iPhone 14 Pro Max',
    },
    {
      name: 'Emma Thompson',
      avatar: '/api/placeholder/48/48',
      date: 'March 23, 2024',
      rating: 5,
      content:
        'As a developer, the MacBook Pro M2 has transformed my workflow. The performance is unmatched, and the battery life is extraordinary.',
      productPurchased: 'MacBook Pro M2',
    },
    {
      name: 'David Chen',
      avatar: '/api/placeholder/48/48',
      date: 'March 20, 2024',
      rating: 5,
      content:
        'The iPad Pro is the perfect creative tool. The M2 chip makes everything lightning fast, and the display is simply stunning.',
      productPurchased: 'iPad Pro',
    },
  ];

  return (
    <Layout>
      <Box minH="100vh" bg={bgColor}>
        {/* Hero Section */}
        <Box
          bgGradient="linear(to-r, blue.600, blue.400)"
          color="white"
          py={20}
          position="relative"
          overflow="hidden"
        >
          <Container maxW="container.xl">
            <VStack spacing={8} textAlign="center">
              <Heading
                fontSize={{ base: '4xl', md: '6xl' }}
                fontWeight="bold"
                lineHeight="shorter"
              >
                Discover Premium Technology
              </Heading>
              <Text fontSize="xl" maxW="2xl" opacity={0.9}>
                Experience innovation with our carefully curated collection of
                premium devices and accessories. Elevate your digital lifestyle
                today.
              </Text>
              <HStack spacing={4}>
                <Button
                  size="lg"
                  colorScheme="white"
                  variant="solid"
                  onClick={() => navigate('/products')}
                  rightIcon={<FiShoppingBag />}
                  _hover={{ bg: 'white', color: 'blue.500' }}
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Learn More
                </Button>
              </HStack>
            </VStack>
          </Container>
        </Box>

        {/* Stats Section */}
        <Container maxW="container.xl" transform="translateY(-8rem)">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            bg={useColorModeValue('white', 'gray.800')}
            rounded="2xl"
            shadow="xl"
            p={8}
          >
            <Stat textAlign="center">
              <StatNumber fontSize="4xl" fontWeight="bold" color="blue.500">
                50K+
              </StatNumber>
              <StatLabel fontSize="lg">Happy Customers</StatLabel>
            </Stat>
            <Stat textAlign="center">
              <StatNumber fontSize="4xl" fontWeight="bold" color="blue.500">
                1000+
              </StatNumber>
              <StatLabel fontSize="lg">Products Available</StatLabel>
            </Stat>
            <Stat textAlign="center">
              <StatNumber fontSize="4xl" fontWeight="bold" color="blue.500">
                24/7
              </StatNumber>
              <StatLabel fontSize="lg">Customer Support</StatLabel>
            </Stat>
          </SimpleGrid>
        </Container>

        {/* Featured Products */}
        <Container maxW="container.xl" py={0}>
          <VStack spacing={12}>
            <VStack spacing={4}>
              <Heading size="2xl">Featured Products</Heading>
              <Text color="gray.600" textAlign="center" maxW="2xl">
                Discover our hand-picked selection of premium tech products
              </Text>
            </VStack>

            {isLoading ? (
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height="500px" rounded="lg" />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                {products.map((product) => (
                  <FeaturedProduct key={product._id} product={product} />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>

        {/* Features Section */}
        <Box bg={useColorModeValue('gray.100', 'gray.700')} py={20}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <VStack spacing={4}>
                <Heading size="2xl">Why Choose Us</Heading>
                <Text color="gray.600" textAlign="center" maxW="2xl">
                  Experience premium service with every purchase
                </Text>
              </VStack>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                <FeatureCard
                  icon={FiAward}
                  title="Premium Quality"
                  description="Only the highest quality products from trusted brands"
                />
                <FeatureCard
                  icon={FiTruck}
                  title="Fast Delivery"
                  description="Free express shipping on orders over $100"
                />
                <FeatureCard
                  icon={FiHeadphones}
                  title="24/7 Support"
                  description="Expert assistance whenever you need it"
                />
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Customer Reviews */}
        <Container maxW="container.xl" py={20}>
          <VStack spacing={12}>
            <VStack spacing={4}>
              <Heading size="2xl">Customer Reviews</Heading>
              <Text color="gray.600" textAlign="center" maxW="2xl">
                See what our customers have to say about their experience
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {customerReviews.map((review, index) => (
                <CustomerReview key={index} review={review} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* CTA Section */}
        <Box bg="blue.600" color="white" py={20}>
          <Container maxW="container.xl">
            <VStack spacing={8} textAlign="center">
              <Heading size="2xl">Ready to Start Shopping?</Heading>
              <Text fontSize="xl" maxW="2xl" opacity={0.9}>
                Browse our complete collection and find your perfect tech
                companion today
              </Text>
              <Button
                size="lg"
                colorScheme="white"
                variant="solid"
                onClick={() => navigate('/products')}
                rightIcon={<FiShoppingBag />}
                _hover={{ bg: 'white', color: 'blue.500' }}
              >
                View All Products
              </Button>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
};

export default HomePage;
