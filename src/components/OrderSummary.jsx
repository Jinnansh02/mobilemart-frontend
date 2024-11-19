// OrderSummary.jsx
import React from 'react';
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';

const MotionBox = motion(Box);

const OrderSummary = ({
  cart,
  subtotal,
  shipping,
  tax,
  total,
  isProcessing,
  onPlaceOrder,
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        position="sticky"
        top="24px"
        bg={useColorModeValue('white', 'gray.800')}
        rounded="lg"
        shadow="lg"
        overflow="hidden"
      >
        <Box p={6}>
          <Heading size="lg" mb={6}>
            Order Summary
          </Heading>

          {/* Cart Items */}
          <VStack spacing={4} align="stretch" mb={6}>
            {cart.map((item) => (
              <HStack key={item.id} justify="space-between">
                <HStack spacing={4}>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    boxSize="50px"
                    objectFit="cover"
                    rounded="md"
                  />
                  <Box>
                    <Text fontWeight="medium">{item.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Quantity: {item.quantity}
                    </Text>
                  </Box>
                </HStack>
                <Text fontWeight="medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Divider mb={6} />

          {/* Totals */}
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text color="gray.600">Subtotal</Text>
              <Text fontWeight="medium">${subtotal.toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">Shipping</Text>
              <Text fontWeight="medium">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">Tax (13%)</Text>
              <Text fontWeight="medium">${tax.toFixed(2)}</Text>
            </HStack>
            <Divider />
            <HStack justify="space-between" fontSize="lg" fontWeight="bold">
              <Text>Total</Text>
              <Text>${total.toFixed(2)}</Text>
            </HStack>
          </VStack>

          {/* Place Order Button */}
          <Button
            colorScheme="blue"
            size="lg"
            width="100%"
            mt={6}
            onClick={onPlaceOrder}
            isLoading={isProcessing}
            loadingText="Processing Order"
            leftIcon={<FiLock />}
          >
            Place Order
          </Button>

          {shipping > 0 && (
            <Text color="green.500" fontSize="sm" mt={2} textAlign="center">
              Add ${(100 - subtotal).toFixed(2)} more for free shipping
            </Text>
          )}

          {/* Security Badges */}
          <VStack spacing={2} mt={6}>
            <HStack spacing={2} color="gray.600" fontSize="sm">
              <FiLock />
              <Text>Secure Payment</Text>
            </HStack>
            <Text color="gray.500" fontSize="xs" textAlign="center">
              Your payment information is processed securely by Stripe
            </Text>
          </VStack>
        </Box>
      </Box>
    </MotionBox>
  );
};

export default OrderSummary;
