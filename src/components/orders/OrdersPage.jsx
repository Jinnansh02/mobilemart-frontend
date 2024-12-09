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
  useDisclosure,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import Layout from '../Layout';
import OrderDetailsModal from './OrderDetailsModal';

const OrderStatusBadge = ({ status }) => {
  let colorScheme;
  switch (status) {
    case 'delivered':
      colorScheme = 'green';
      break;
    case 'processing':
      colorScheme = 'orange';
      break;
    case 'cancelled':
      colorScheme = 'red';
      break;
    case 'shipped':
      colorScheme = 'blue';
      break;
    case 'out_for_delivery':
      colorScheme = 'cyan';
      break;
    case 'pending':
      colorScheme = 'gray';
      break;
    case 'returned':
      colorScheme = 'pink';
      break;
    case 'refunded':
      colorScheme = 'purple';
      break;
    default:
      colorScheme = 'blue';
  }

  return (
    <Badge colorScheme={colorScheme} px={2} py={1} rounded="md">
      {status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="refunded">Refunded</option>
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
                      <Text fontSize="sm" color="gray.500" noOfLines={1}>
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
