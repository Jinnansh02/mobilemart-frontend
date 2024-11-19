import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useToast,
  Flex,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Layout from './Layout';
import {
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../store/authSlice';

const MotionBox = motion(Box);

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <VStack spacing={4} py={10}>
      <Box fontSize="6xl">
        <FiShoppingCart />
      </Box>
      <Heading size="lg">Your cart is empty</Heading>
      <Text color="gray.600">
        Add some items to your cart and they will appear here
      </Text>
      <Button
        colorScheme="blue"
        size="lg"
        onClick={() => navigate('/products')}
      >
        Continue Shopping
      </Button>
    </VStack>
  );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        p={4}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        rounded="lg"
        shadow="sm"
        _hover={{ shadow: 'md' }}
        transition="all 0.2s"
      >
        <Grid
          templateColumns={{
            base: '1fr',
            md: '120px 1fr auto auto',
          }}
          gap={6}
          alignItems="center"
        >
          {/* Product Image */}
          <Image
            src={item.imageUrl}
            alt={item.name}
            objectFit="cover"
            width="120px"
            height="120px"
            rounded="md"
          />

          {/* Product Details */}
          <VStack align="start" spacing={1}>
            <Heading size="md">{item.name}</Heading>
            <Text color="blue.600" fontSize="lg" fontWeight="bold">
              ${item.price.toFixed(2)}
            </Text>
            <Badge colorScheme="green">In Stock</Badge>
          </VStack>

          {/* Quantity Controls */}
          <NumberInput
            defaultValue={item.quantity}
            min={1}
            max={item.stock}
            maxW={32}
            onChange={(value) => onUpdateQuantity(item.id, parseInt(value))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          {/* Remove Button & Subtotal */}
          <VStack align="end" spacing={2}>
            <Text fontWeight="bold" fontSize="lg">
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
            <IconButton
              icon={<FiTrash2 />}
              colorScheme="red"
              variant="ghost"
              onClick={() => onRemove(item.id)}
              aria-label="Remove item"
            />
          </VStack>
        </Grid>
      </Box>
    </MotionBox>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Get cart items from Redux store
  const { cart } = useSelector((state) => state.auth);

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate shipping (free over $100)
  const shippingCost = cartTotal > 100 ? 0 : 10;

  // Calculate total with shipping
  const orderTotal = cartTotal + shippingCost;

  const handleUpdateQuantity = (itemId, newQuantity) => {
    dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity }));
    toast({
      title: 'Cart updated',
      status: 'success',
      duration: 2000,
    });
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast({
      title: 'Item removed',
      status: 'success',
      duration: 2000,
    });
  };

  const handleCheckout = () => {
    // Handle checkout logic here
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <Container maxW="container.xl">
          <EmptyCart />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Cart Items */}
          <Box>
            <Heading size="lg" mb={6}>
              Shopping Cart ({cart.length}{' '}
              {cart.length === 1 ? 'item' : 'items'})
            </Heading>
            <VStack spacing={4} align="stretch">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </VStack>
          </Box>

          {/* Order Summary */}
          <Box>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              position="sticky"
              top="24px"
            >
              <Box
                borderWidth="1px"
                borderColor={borderColor}
                rounded="lg"
                p={6}
                bg={bgColor}
                shadow="md"
              >
                <Heading size="lg" mb={6}>
                  Order Summary
                </Heading>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text color="gray.600">Subtotal</Text>
                    <Text fontWeight="bold">${cartTotal.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">Shipping</Text>
                    <Text fontWeight="bold">
                      {shippingCost === 0
                        ? 'Free'
                        : `$${shippingCost.toFixed(2)}`}
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between">
                    <Text color="gray.600">Total</Text>
                    <Text fontSize="xl" fontWeight="bold">
                      ${orderTotal.toFixed(2)}
                    </Text>
                  </HStack>

                  {cartTotal < 100 && (
                    <Text color="green.500" fontSize="sm">
                      Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                    </Text>
                  )}

                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleCheckout}
                    w="100%"
                    mt={4}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/products')}
                    w="100%"
                  >
                    Continue Shopping
                  </Button>
                </VStack>
              </Box>
            </MotionBox>
          </Box>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CartPage;
