import React from 'react';
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
} from '@chakra-ui/react';
import { FiDownload, FiExternalLink, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

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

const OrderStatusHistory = ({ statusHistory }) => {
  if (!statusHistory || statusHistory.length === 0) return null;

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="sm">Status History</Heading>
      <VStack align="stretch" spacing={3}>
        {statusHistory.map((status, index) => (
          <HStack key={index} spacing={4}>
            <Box color="gray.500">
              <FiClock />
            </Box>
            <VStack align="start" spacing={0}>
              <HStack>
                <OrderStatusBadge status={status.status} />
                <Text fontSize="sm" color="gray.500">
                  {format(new Date(status.timestamp), 'PPp')}
                </Text>
              </HStack>
              {status.comment && (
                <Text fontSize="sm" color="gray.600">
                  {status.comment}
                </Text>
              )}
            </VStack>
          </HStack>
        ))}
      </VStack>
    </VStack>
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

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <>
                <Divider />
                <OrderStatusHistory statusHistory={order.statusHistory} />
              </>
            )}

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
            {/* <HStack justify="flex-end" spacing={4}>
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                onClick={() => {}}
              >
                Download Invoice
              </Button>
              {order.status === 'pending' && (
                <Button colorScheme="red" variant="ghost" onClick={() => {}}>
                  Cancel Order
                </Button>
              )}
            </HStack> */}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailsModal;
