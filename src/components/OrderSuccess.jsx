import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { clearCart } from '../store/authSlice';
import Layout from './Layout';
import { apiClient } from '../utils/apiClient'; // Adjust import path as needed

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!orderId) {
          toast({
            title: 'Error',
            description: 'Order ID not found',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/');
          return;
        }

        const response = await apiClient.get(
          `/api/orders/check-payment-status/${orderId}`
        );

        if (response.data.isPaid) {
          setPaymentVerified(true);
          dispatch(clearCart());
        } else {
          // If payment is not verified, show error and redirect
          toast({
            title: 'Payment Incomplete',
            description:
              'Your payment has not been completed. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/cart');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to verify payment status',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [dispatch, navigate, orderId, toast]);

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.md" py={20}>
          <VStack spacing={8}>
            <Spinner size="xl" />
            <Text>Verifying your payment...</Text>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (!paymentVerified) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} textAlign="center">
          <CheckCircleIcon w={20} h={20} color="green.500" />
          <Heading>Thank You For Your Order!</Heading>
          <Text fontSize="lg" color="gray.600">
            Your payment has been verified and your order is being processed.
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
