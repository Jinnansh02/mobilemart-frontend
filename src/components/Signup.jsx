import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  FormErrorMessage,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Layout from './Layout';
import { authService } from '../services/authServices';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  const handleSignup = async (values, actions) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = values;

      await authService.signup(signupData);

      toast({
        title: 'Signup successful',
        description: 'Please login with your credentials',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/login');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box bg={bgColor} minH="100vh" py={12} px={4}>
        <Box maxWidth="400px" m="0 auto">
          <Box bg={boxBgColor} p={8} borderRadius="lg" boxShadow="lg">
            <Heading mb={6} textAlign="center">
              Sign Up
            </Heading>
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSignup}
            >
              {(props) => (
                <Form>
                  <VStack spacing={4}>
                    <Field name="name">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input
                            {...field}
                            id="name"
                            placeholder="Enter your name"
                          />
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.email && form.touched.email}
                        >
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <Input
                            {...field}
                            id="email"
                            placeholder="Enter your email"
                          />
                          <FormErrorMessage>
                            {form.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="password">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.password && form.touched.password
                          }
                        >
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                          />
                          <FormErrorMessage>
                            {form.errors.password}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="confirmPassword">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.confirmPassword &&
                            form.touched.confirmPassword
                          }
                        >
                          <FormLabel htmlFor="confirmPassword">
                            Confirm Password
                          </FormLabel>
                          <Input
                            {...field}
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                          />
                          <FormErrorMessage>
                            {form.errors.confirmPassword}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Button
                      mt={4}
                      colorScheme="blue"
                      isLoading={props.isSubmitting}
                      type="submit"
                      width="full"
                    >
                      Sign Up
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
            <Text mt={4} textAlign="center">
              Already have an account?{' '}
              <Link color="blue.500" href="/login">
                Login
              </Link>
            </Text>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
