import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { clearCart } from '../store/authSlice';
import Layout from './Layout';

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear cart after successful payment
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <Layout>
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} textAlign="center">
          <CheckCircleIcon w={20} h={20} color="green.500" />
          <Heading>Thank You For Your Order!</Heading>
          <Text fontSize="lg" color="gray.600">
            Your order has been successfully placed and is being processed.
          </Text>
          <Text>Order ID: {orderId}</Text>
          <Box pt={6}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate('/orders')}
              mb={4}
            >
              View My Orders
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/products')}
              ml={4}
            >
              Continue Shopping
            </Button>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
};

export default OrderSuccessPage;
