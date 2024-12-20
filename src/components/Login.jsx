import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import { authService } from '../services/authServices';
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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  const handleLogin = async (values, actions) => {
    try {
      const data = await authService.login(values);
      dispatch(setCredentials(data));

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      });

      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
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
              Login
            </Heading>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {(props) => (
                <Form>
                  <VStack spacing={4}>
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
                    <Button
                      mt={4}
                      colorScheme="blue"
                      isLoading={props.isSubmitting}
                      type="submit"
                      width="full"
                    >
                      Login
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
            <Text mt={4} textAlign="center">
              Don't have an account?{' '}
              <Link color="blue.500" href="/sign-up">
                Sign Up
              </Link>
            </Text>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
