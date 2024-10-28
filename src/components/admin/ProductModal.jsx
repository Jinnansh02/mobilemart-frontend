import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Image,
  Stack,
  HStack,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftAddon,
  Switch,
  useToast,
  FormHelperText,
} from '@chakra-ui/react';
import { apiClient } from '../../utils/apiClient';

const ProductModal = ({ isOpen, onClose, product, categories, onSuccess }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
    isActive: true,
  });

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category._id,
        stock: product.stock,
        sku: product.sku,
        isActive: product.isActive,
      });
      setImagePreview(product.imageUrl);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      sku: '',
      isActive: true,
    });
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: 'Error',
          description: 'Image size should be less than 5MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      if (product) {
        // Update
        await apiClient.put(`/api/products/${product._id}`, formDataToSend);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        // Create
        await apiClient.post('/api/products', formDataToSend);
        toast({
          title: 'Success',
          description: 'Product created successfully',
          status: 'success',
          duration: 3000,
        });
      }
      onSuccess();
      handleClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to save product',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {product ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={4}>
              <HStack spacing={4} align="start">
                <Box flex="1">
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter product name"
                    />
                  </FormControl>
                </Box>
                <Box flex="1">
                  <FormControl isRequired>
                    <FormLabel>SKU</FormLabel>
                    <Input
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="Enter SKU"
                    />
                  </FormControl>
                </Box>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter product description"
                  rows={4}
                />
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="$" />
                    <NumberInput
                      min={0}
                      precision={2}
                      value={formData.price}
                      onChange={(value) =>
                        setFormData({ ...formData, price: value })
                      }
                    >
                      <NumberInputField placeholder="0.00" />
                    </NumberInput>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Stock</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.stock}
                    onChange={(value) =>
                      setFormData({ ...formData, stock: value })
                    }
                  >
                    <NumberInputField placeholder="0" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Product Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  sx={{
                    '::file-selector-button': {
                      height: 10,
                      padding: '0 16px',
                      background: 'gray.100',
                      border: 'none',
                      borderRadius: 'md',
                      mr: 2,
                    },
                  }}
                />
                <FormHelperText>Maximum file size: 5MB</FormHelperText>
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    mt={2}
                    maxH="200px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                )}
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="is-active" mb="0">
                  Active Status
                </FormLabel>
                <Switch
                  id="is-active"
                  isChecked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Saving..."
            >
              {product ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
