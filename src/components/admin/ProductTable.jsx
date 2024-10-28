import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
  Badge,
  IconButton,
  HStack,
  VStack,
  Skeleton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const ProductTable = ({ products, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box
      bg="white"
      shadow="sm"
      rounded="lg"
      overflow="hidden"
      borderWidth="1px"
    >
      <Table variant="simple">
        <Thead>
          <Tr bg="gray.50">
            <Th>Image</Th>
            <Th>Product Info</Th>
            <Th>Category</Th>
            <Th>Stock & Price</Th>
            <Th>Status</Th>
            <Th width="100px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product._id}>
              <Td>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  boxSize="60px"
                  objectFit="cover"
                  rounded="md"
                />
              </Td>
              <Td>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">{product.name}</Text>
                  <Text color="gray.600" fontSize="sm">
                    SKU: {product.sku}
                  </Text>
                </VStack>
              </Td>
              <Td>
                <Badge colorScheme="blue">{product.category?.title}</Badge>
              </Td>
              <Td>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">${product.price.toFixed(2)}</Text>
                  <Text color="gray.600" fontSize="sm">
                    Stock: {product.stock}
                  </Text>
                </VStack>
              </Td>
              <Td>
                <Badge colorScheme={product.isActive ? 'green' : 'red'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit product"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => onEdit(product)}
                  />
                  <IconButton
                    aria-label="Delete product"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => onDelete(product._id)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const LoadingSkeleton = () => (
  <Box bg="white" shadow="sm" rounded="lg" overflow="hidden" borderWidth="1px">
    <Table variant="simple">
      <Thead>
        <Tr bg="gray.50">
          <Th>Image</Th>
          <Th>Product Info</Th>
          <Th>Category</Th>
          <Th>Stock & Price</Th>
          <Th>Status</Th>
          <Th width="100px">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[...Array(3)].map((_, i) => (
          <Tr key={i}>
            <Td>
              <Skeleton height="60px" width="60px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

const EmptyState = () => (
  <Box bg="white" p={8} textAlign="center" rounded="lg" borderWidth="1px">
    <Text color="gray.500">No products found</Text>
  </Box>
);

export default ProductTable;
