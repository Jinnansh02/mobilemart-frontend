import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Grid,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Skeleton,
  Alert,
  AlertIcon,
  Divider,
  Link,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiEye,
  FiDownload,
  FiExternalLink,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import Layout from './Layout';

const OrderStatusBadge = ({ status }) => {
  let colorScheme;
  switch (status) {
    case 'Delivered':
      colorScheme = 'green';
      break;
    case 'Processing':
      colorScheme = 'orange';
      break;
    case 'Cancelled':
      colorScheme = 'red';
      break;
    default:
      colorScheme = 'blue';
  }

  return (
    <Badge colorScheme={colorScheme} px={2} py={1} rounded="md">
      {status}
    </Badge>
  );
};

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Order Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Order Summary */}
            <Box>
              <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                <Box p={4} bg="gray.50" rounded="md">
                  <Text color="gray.600">Order ID</Text>
                  <Text fontWeight="bold">{order._id}</Text>
                </Box>
                <Box p={4} bg="gray.50" rounded="md">
                  <Text color="gray.600">Order Date</Text>
                  <Text fontWeight="bold">
                    {format(new Date(order.createdAt), 'PPP')}
                  </Text>
                </Box>
                <Box p={4} bg="gray.50" rounded="md">
                  <Text color="gray.600">Status</Text>
                  <OrderStatusBadge status={order.status} />
                </Box>
                <Box p={4} bg="gray.50" rounded="md">
                  <Text color="gray.600">Total Amount</Text>
                  <Text fontWeight="bold" color="blue.600">
                    ${order.totalPrice.toFixed(2)}
                  </Text>
                </Box>
              </Grid>
            </Box>

            {/* Shipping Information */}
            <Box>
              <Heading size="md" mb={4}>
                Shipping Information
              </Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Box>
                  <Text color="gray.600">Recipient</Text>
                  <Text fontWeight="medium">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </Text>
                </Box>
                <Box>
                  <Text color="gray.600">Phone</Text>
                  <Text fontWeight="medium">{order.shippingAddress.phone}</Text>
                </Box>
                <Box gridColumn="span 2">
                  <Text color="gray.600">Address</Text>
                  <Text fontWeight="medium">
                    {order.shippingAddress.address}
                    {order.shippingAddress.apartment &&
                      `, ${order.shippingAddress.apartment}`}
                  </Text>
                  <Text fontWeight="medium">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </Text>
                  <Text fontWeight="medium">
                    {order.shippingAddress.country}
                  </Text>
                </Box>
              </Grid>
            </Box>

            <Divider />

            {/* Order Items */}
            <Box>
              <Heading size="md" mb={4}>
                Order Items
              </Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {order.orderItems.map((item) => (
                    <Tr key={item._id}>
                      <Td>
                        <HStack>
                          <Image
                            src={item.image}
                            alt={item.name}
                            boxSize="50px"
                            objectFit="cover"
                            rounded="md"
                          />
                          <Box>
                            <Text fontWeight="medium">{item.name}</Text>
                            <Link
                              color="blue.500"
                              fontSize="sm"
                              onClick={() =>
                                window.open(
                                  `/products/${item.product}`,
                                  '_blank'
                                )
                              }
                            >
                              View Product{' '}
                              <FiExternalLink style={{ display: 'inline' }} />
                            </Link>
                          </Box>
                        </HStack>
                      </Td>
                      <Td>${item.price.toFixed(2)}</Td>
                      <Td>{item.quantity}</Td>
                      <Td isNumeric>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Divider />

            {/* Order Summary */}
            <Box>
              <Heading size="md" mb={4}>
                Order Summary
              </Heading>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text>${order.itemsPrice.toFixed(2)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text>${order.shippingPrice.toFixed(2)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Tax</Text>
                  <Text>${order.taxPrice.toFixed(2)}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between" fontWeight="bold">
                  <Text>Total</Text>
                  <Text color="blue.600">${order.totalPrice.toFixed(2)}</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Action Buttons */}
            <HStack justify="flex-end" spacing={4}>
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                onClick={() => {
                  /* Handle invoice download */
                }}
              >
                Download Invoice
              </Button>
              {order.status === 'Processing' && (
                <Button
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => {
                    /* Handle cancel order */
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/orders/myorders');
      setOrders(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'total-asc':
          return a.totalPrice - b.totalPrice;
        case 'total-desc':
          return b.totalPrice - a.totalPrice;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={4} align="stretch">
            <Skeleton height="40px" />
            <Skeleton height="60px" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height="100px" />
            ))}
          </VStack>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              My Orders
            </Heading>
            <Text color="gray.600">View and manage your order history</Text>
          </Box>

          {/* Filters */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              leftIcon={<FiFilter />}
            >
              <option value="all">All Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Select>

            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="total-desc">Highest Amount</option>
              <option value="total-asc">Lowest Amount</option>
            </Select>
          </Grid>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              No orders found.
            </Alert>
          ) : (
            <VStack spacing={4} align="stretch">
              {filteredOrders.map((order) => (
                <Box
                  key={order._id}
                  p={6}
                  borderWidth="1px"
                  rounded="lg"
                  bg="white"
                  shadow="sm"
                  _hover={{ shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(4, 1fr) auto' }}
                    gap={4}
                    alignItems="center"
                  >
                    {/* Order Info */}
                    <Box>
                      <Text color="gray.600" fontSize="sm">
                        Order ID
                      </Text>
                      <Text fontWeight="medium">{order._id}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {format(new Date(order.createdAt), 'PPP')}
                      </Text>
                    </Box>

                    {/* Items Summary */}
                    <Box>
                      <Text color="gray.600" fontSize="sm">
                        Items
                      </Text>
                      <Text fontWeight="medium">
                        {order.orderItems.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}{' '}
                        items
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {order.orderItems.map((item) => item.name).join(', ')}
                      </Text>
                    </Box>

                    {/* Total */}
                    <Box>
                      <Text color="gray.600" fontSize="sm">
                        Total Amount
                      </Text>
                      <Text fontWeight="bold" color="blue.600">
                        ${order.totalPrice.toFixed(2)}
                      </Text>
                    </Box>

                    {/* Status */}
                    <Box>
                      <Text color="gray.600" fontSize="sm">
                        Status
                      </Text>
                      <OrderStatusBadge status={order.status} />
                    </Box>

                    {/* Actions */}
                    <HStack justify="flex-end">
                      <Button
                        leftIcon={<FiEye />}
                        variant="ghost"
                        onClick={() => handleViewOrder(order)}
                      >
                        View Details
                      </Button>
                    </HStack>
                  </Grid>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          order={selectedOrder}
        />
      </Container>
    </Layout>
  );
};

export default OrdersPage;
