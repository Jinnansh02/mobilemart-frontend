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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  useDisclosure,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiDownload,
  FiEye,
} from 'react-icons/fi';
import { format } from 'date-fns';
import AdminLayout from '../AdminLayout';
import AdminOrderDetails from './AdminOrderDetails';
import { apiClient } from '../../../utils/apiClient';

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

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/orders');
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      await apiClient.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: 'Success',
        description: 'Order status updated successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={4} align="stretch">
            <Skeleton height="40px" />
            <Skeleton height="60px" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height="100px" />
            ))}
          </VStack>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Box>
                <Heading size="lg" mb={2}>
                  Orders Management
                </Heading>
                <Text color="gray.600">Manage and process customer orders</Text>
              </Box>
            </HStack>
          </Box>

          {/* Filters */}
          <HStack spacing={4}>
            <InputGroup maxW="320px">
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
              maxW="200px"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
          </HStack>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              No orders found.
            </Alert>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>Date</Th>
                    <Th>Customer</Th>
                    <Th>Total</Th>
                    <Th>Payment</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.map((order) => (
                    <Tr key={order._id}>
                      <Td>{order._id}</Td>
                      <Td>
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </Td>
                      <Td>
                        <Text fontWeight="medium">
                          {order.shippingAddress.firstName}{' '}
                          {order.shippingAddress.lastName}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {order.shippingAddress.email}
                        </Text>
                      </Td>
                      <Td>${order.totalPrice.toFixed(2)}</Td>
                      <Td>
                        <Badge
                          colorScheme={order.isPaid ? 'green' : 'yellow'}
                          px={2}
                          py={1}
                          rounded="md"
                        >
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </Badge>
                      </Td>
                      <Td>
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          isDisabled={isUpdatingStatus}
                          size="sm"
                          width="150px"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">
                            Out for Delivery
                          </option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                          <option value="refunded">Refunded</option>
                        </Select>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<FiEye />}
                            variant="ghost"
                            onClick={() => handleViewOrder(order)}
                            aria-label="View order details"
                          />
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              aria-label="More options"
                            />
                            <MenuList>
                              <MenuItem
                                onClick={() => {
                                  /* Handle print */
                                }}
                              >
                                Print Invoice
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  /* Handle email */
                                }}
                              >
                                Email Customer
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </VStack>

        {/* Order Details Modal */}
        <AdminOrderDetails
          isOpen={isOpen}
          onClose={onClose}
          order={selectedOrder}
          onStatusChange={handleStatusChange}
          refetchOrders={fetchOrders}
        />
      </Container>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
