import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  VStack,
  useToast,
  Image,
  Checkbox,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { FiCreditCard } from 'react-icons/fi';
import { clearCart } from '../store/authSlice';
import { apiClient } from '../utils/apiClient';
import Layout from './Layout';
import OrderSummary from './OrderSummary';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { cart } = useSelector((state) => state.auth);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Canada',
  });

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.13;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login first',
        description: 'You need to be logged in to checkout',
        status: 'warning',
        duration: 3000,
      });
      // Save current location for redirect after login
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty',
        status: 'warning',
        duration: 3000,
      });
      navigate('/products');
      return;
    }

    // Pre-fill user data if available
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }));
    }
  }, [isAuthenticated, cart, navigate, toast, user]);

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation - Accept format: (XXX) XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
    if (
      formData.phone &&
      !/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Canadian Postal Code validation
    if (
      formData.country === 'Canada' &&
      formData.zipCode &&
      !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.zipCode)
    ) {
      newErrors.zipCode = 'Please enter a valid postal code';
    }

    // US ZIP Code validation
    if (
      formData.country === 'United States' &&
      formData.zipCode &&
      !/^\d{5}(-\d{4})?$/.test(formData.zipCode)
    ) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast({
        title: 'Form Error',
        description: 'Please fill all required fields correctly',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setIsProcessing(true);

      const orderData = {
        orderItems: cart.map((item) => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          image: item.imageUrl,
          price: item.price,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      // Create order and get Stripe session
      const response = await apiClient.post('/api/orders', orderData);
      const { sessionUrl } = response.data;

      // Save address if requested
      if (saveAddress) {
        try {
          await apiClient.post('/api/users/address', {
            shippingAddress: orderData.shippingAddress,
          });
        } catch (error) {
          console.error('Failed to save address:', error);
        }
      }

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process order',
        status: 'error',
        duration: 5000,
      });
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8}>
          {/* Left Column - Form */}
          <Box>
            <VStack spacing={8} align="stretch">
              {/* Shipping Information */}
              <Box>
                <Heading size="lg" mb={6}>
                  Shipping Information
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isRequired isInvalid={errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.phone}>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 555-5555"
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={errors.address}
                    gridColumn="span 2"
                  >
                    <FormLabel>Address</FormLabel>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                    />
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>

                  <FormControl gridColumn="span 2">
                    <FormLabel>Apartment, suite, etc.</FormLabel>
                    <Input
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Apt #"
                    />
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.city}>
                    <FormLabel>City</FormLabel>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                    <FormErrorMessage>{errors.city}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.state}>
                    <FormLabel>Province/State</FormLabel>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Province/State"
                    />
                    <FormErrorMessage>{errors.state}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.zipCode}>
                    <FormLabel>Postal/ZIP Code</FormLabel>
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder={
                        formData.country === 'Canada' ? 'A1A 1A1' : '12345'
                      }
                    />
                    <FormErrorMessage>{errors.zipCode}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Country</FormLabel>
                    <Select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="Canada">Canada</option>
                      <option value="United States">United States</option>
                    </Select>
                  </FormControl>
                </Grid>

                <Checkbox
                  mt={4}
                  isChecked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                >
                  Save this address for future orders
                </Checkbox>
              </Box>

              {/* Payment Method */}
              <Box>
                <Heading size="lg" mb={6}>
                  Payment Method
                </Heading>
                <Alert status="info" mb={4}>
                  <AlertIcon />
                  <AlertDescription>
                    We use Stripe for secure payment processing
                  </AlertDescription>
                </Alert>
                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                  <Stack spacing={4}>
                    <Radio value="card">
                      <HStack spacing={4}>
                        <FiCreditCard />
                        <Text>Credit/Debit Card</Text>
                        <Image
                          src="https://placehold.co/200x30"
                          alt="Payment Cards"
                          height="20px"
                        />
                      </HStack>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </VStack>
          </Box>

          {/* Right Column - Order Summary */}
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            isProcessing={isProcessing}
            onPlaceOrder={handlePlaceOrder}
          />
        </Grid>
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
