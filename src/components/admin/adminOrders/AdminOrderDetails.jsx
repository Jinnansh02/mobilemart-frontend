import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Grid,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Button,
  Divider,
  Link,
  FormControl,
  FormLabel,
  Select,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FiDownload,
  FiExternalLink,
  FiClock,
  FiMail,
  FiPrinter,
} from 'react-icons/fi';
import { format } from 'date-fns';
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

const AdminOrderDetails = ({
  isOpen,
  onClose,
  order,
  onStatusChange,
  refetchOrders,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newStatus, setNewdStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const cancelAlertProps = useDisclosure();
  const cancelRef = React.useRef();

  if (!order) return null;

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast({
        title: 'Error',
        description: 'Please select a status',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setIsUpdating(true);
      await apiClient.put(`/api/orders/${order._id}/status`, {
        status: selectedStatus,
      });
      setSelectedStatus('');
      onStatusChange(order._id, selectedStatus);
      setNewdStatus(selectedStatus);
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
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    await handleUpdateStatus('cancelled');
    cancelAlertProps.onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {/* Order Summary */}
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
                  <Text color="gray.600">Payment Status</Text>
                  <Badge
                    colorScheme={order.isPaid ? 'green' : 'yellow'}
                    px={2}
                    py={1}
                    rounded="md"
                  >
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </Box>
                <Box p={4} bg="gray.50" rounded="md">
                  <Text color="gray.600">Total Amount</Text>
                  <Text fontWeight="bold" color="blue.600">
                    ${order.totalPrice.toFixed(2)}
                  </Text>
                </Box>
              </Grid>

              {/* Status Update */}
              <Box p={4} bg="gray.50" rounded="md">
                <Heading size="sm" mb={4}>
                  Update Status
                </Heading>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text color="gray.600" mb={2}>
                      Current Status
                    </Text>
                    <OrderStatusBadge status={newStatus || order.status} />
                  </Box>
                  <FormControl>
                    <FormLabel>New Status</FormLabel>
                    <Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      placeholder="Select new status"
                    >
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
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    onClick={handleUpdateStatus}
                    isLoading={isUpdating}
                    alignSelf="flex-end"
                  >
                    Update Status
                  </Button>
                </VStack>
              </Box>

              {/* Customer Information */}
              <Box>
                <Heading size="md" mb={4}>
                  Customer Information
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text color="gray.600">Name</Text>
                    <Text fontWeight="medium">
                      {order.shippingAddress.firstName}{' '}
                      {order.shippingAddress.lastName}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.600">Contact</Text>
                    <Text fontWeight="medium">
                      {order.shippingAddress.phone}
                    </Text>
                    <Text fontWeight="medium">
                      {order.shippingAddress.email}
                    </Text>
                  </Box>
                  <Box gridColumn="span 2">
                    <Text color="gray.600">Shipping Address</Text>
                    <Text fontWeight="medium">
                      {order.shippingAddress.address}
                      {order.shippingAddress.apartment &&
                        `, ${order.shippingAddress.apartment}`}
                    </Text>
                    <Text fontWeight="medium">
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
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

              {/* Action Buttons */}
              <HStack justify="flex-end" spacing={4}>
                {/* <Button
                  leftIcon={<FiMail />}
                  variant="outline"
                  onClick={() => {
                  }}
                >
                  Email Customer
                </Button>
                <Button
                  leftIcon={<FiPrinter />}
                  variant="outline"
                  onClick={() => {
                  }}
                >
                  Print Invoice
                </Button>
                <Button
                  leftIcon={<FiDownload />}
                  variant="outline"
                  onClick={() => {
                  }}
                >
                  Download Invoice
                </Button> */}
                {order.status !== 'cancelled' && (
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    onClick={cancelAlertProps.onOpen}
                  >
                    Cancel Order
                  </Button>
                )}
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Cancel Order Confirmation */}
      <AlertDialog
        isOpen={cancelAlertProps.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={cancelAlertProps.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Order
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={cancelAlertProps.onClose}>
                No, Keep Order
              </Button>
              <Button colorScheme="red" onClick={handleCancelOrder} ml={3}>
                Yes, Cancel Order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AdminOrderDetails;
