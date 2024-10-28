// src/components/CategoryDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
  useDisclosure,
  IconButton,
  HStack,
  InputGroup,
  InputRightElement,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from '@chakra-ui/icons';
import { apiClient } from '../../utils/apiClient';
import AdminLayout from './AdminLayout';

const CategoryDashboard = () => {
  // States
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // Chakra hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/categories');
      setCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        // Update
        await apiClient.put(
          `/api/categories/${selectedCategory._id}`,
          formData
        );
        toast({
          title: 'Success',
          description: 'Category updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create
        await apiClient.post('/api/categories', formData);
        toast({
          title: 'Success',
          description: 'Category created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to save category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiClient.delete(`/api/categories/${id}`);
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchCategories();
      } catch (err) {
        toast({
          title: 'Error',
          description:
            err.response?.data?.message || 'Failed to delete category',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      title: category.title,
      description: category.description,
    });
    onOpen();
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedCategory(null);
    setFormData({ title: '', description: '' });
    onClose();
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Box>
            <Heading size="lg">Categories Management</Heading>
            <Text color="gray.600" mt={1}>
              Manage your product categories
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => {
              setSelectedCategory(null);
              onOpen();
            }}
          >
            Add Category
          </Button>
        </Flex>

        {/* Search Bar */}
        <Flex mb={6}>
          <InputGroup size="md">
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              pr="4.5rem"
            />
            <InputRightElement>
              <SearchIcon color="gray.500" />
            </InputRightElement>
          </InputGroup>
        </Flex>

        {/* Error Alert */}
        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Categories Table */}
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
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Created At</Th>
                <Th width="100px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                // Loading skeletons
                [...Array(3)].map((_, i) => (
                  <Tr key={i}>
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
                ))
              ) : filteredCategories.length === 0 ? (
                <Tr>
                  <Td colSpan={4}>
                    <Text textAlign="center" py={4} color="gray.500">
                      No categories found
                    </Text>
                  </Td>
                </Tr>
              ) : (
                filteredCategories.map((category) => (
                  <Tr key={category._id}>
                    <Td>
                      <Text fontWeight="medium">{category.title}</Text>
                    </Td>
                    <Td>
                      <Text noOfLines={2}>{category.description}</Text>
                    </Td>
                    <Td>
                      <Text color="gray.600">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit category"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleEdit(category)}
                        />
                        <IconButton
                          aria-label="Delete category"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(category._id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Add/Edit Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <ModalHeader>
                {selectedCategory ? 'Edit Category' : 'Add New Category'}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter category title"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter category description"
                      rows={4}
                    />
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="blue">
                  {selectedCategory ? 'Update' : 'Create'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default CategoryDashboard;
