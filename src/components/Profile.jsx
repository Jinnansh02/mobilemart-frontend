import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Container,
  Avatar,
  Divider,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import Layout from './Layout';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <Box bg={bgColor} minH="100vh" py={12}>
        <Container maxW="container.md">
          <Card bg={cardBg} shadow="lg" rounded="lg">
            <CardHeader>
              <VStack spacing={4} align="center">
                <Avatar
                  size="2xl"
                  name={user.name}
                  src={user.avatar} // If you have avatar URL
                  bg="blue.500"
                />
                <Heading size="lg">{user.name}</Heading>
              </VStack>
            </CardHeader>

            <CardBody>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="sm" color={textColor} mb={1}>
                    Email Address
                  </Text>
                  <Text fontSize="md" fontWeight="medium">
                    {user.email}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color={textColor} mb={2}>
                    Roles
                  </Text>
                  <Box>
                    {user.role.map((role) => (
                      <Badge
                        key={role}
                        colorScheme="blue"
                        mr={2}
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {role}
                      </Badge>
                    ))}
                  </Box>
                </Box>

                <Divider />

                <Button
                  leftIcon={<LogOut size={18} />}
                  colorScheme="red"
                  variant="outline"
                  onClick={handleLogout}
                  width="full"
                >
                  Logout
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </Layout>
  );
};

export default Profile;
