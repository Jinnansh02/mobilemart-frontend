import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  VStack,
  HStack,
  Link,
  Icon,
  useColorModeValue,
  Container,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  HamburgerIcon,
  BoxIcon,
  TagIcon,
  ShoppingCartIcon,
  UsersIcon,
  LogoutIcon,
  ChartBarIcon,
} from '@chakra-ui/icons';
import {
  FiBox,
  FiTag,
  FiShoppingCart,
  FiUsers,
  FiLogOut,
  FiBarChart2,
  FiMenu,
} from 'react-icons/fi';

const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();

  // Move color mode values outside of the mapping function
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const hoverColor = useColorModeValue('blue.600', 'blue.200');
  const activeColor = 'blue.600';
  const inactiveColor = 'gray.700';
  const exitHoverBg = useColorModeValue('red.50', 'red.900');
  const exitHoverColor = useColorModeValue('red.600', 'red.200');

  const navItems = [
    { name: 'Dashboard', icon: FiBarChart2, path: '/admin' },
    { name: 'Products', icon: FiBox, path: '/admin/products' },
    { name: 'Categories', icon: FiTag, path: '/admin/categories' },
    { name: 'Orders', icon: FiShoppingCart, path: '/admin/orders' },
    { name: 'Customers', icon: FiUsers, path: '/admin/customers' },
  ];

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <VStack h="full" spacing={0}>
        <Box w="full" px={4} py={4}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color={useColorModeValue('blue.600', 'blue.400')}
          >
            MobileMart
          </Text>
          <Text
            fontSize="sm"
            textAlign="center"
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            Admin Dashboard
          </Text>
        </Box>

        <VStack w="full" spacing={1} flex={1} pt={8}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              as={RouterLink}
              to={item.path}
              w="full"
              _hover={{ textDecoration: 'none' }}
              onClick={onClose}
            >
              <HStack
                px={4}
                py={3}
                spacing={4}
                bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
                color={
                  location.pathname === item.path ? activeColor : inactiveColor
                }
                _hover={{
                  bg: hoverBg,
                  color: hoverColor,
                }}
                rounded="md"
                mx={2}
              >
                <Icon as={item.icon} boxSize={5} />
                <Text fontWeight="medium">{item.name}</Text>
              </HStack>
            </Link>
          ))}
        </VStack>

        <Box
          w="full"
          p={4}
          borderTop="1px"
          borderTopColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Link
            as={RouterLink}
            to="/"
            w="full"
            _hover={{ textDecoration: 'none' }}
          >
            <HStack
              px={4}
              py={3}
              spacing={4}
              color="gray.700"
              _hover={{
                bg: exitHoverBg,
                color: exitHoverColor,
              }}
              rounded="md"
            >
              <Icon as={FiLogOut} boxSize={5} />
              <Text fontWeight="medium">Exit Admin</Text>
            </HStack>
          </Link>
        </Box>
      </VStack>
    </Box>
  );
};

const AdminLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Mobile nav */}
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        px={4}
        height={16}
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        display={{ base: 'flex', md: 'none' }}
        pos="fixed"
        w="full"
        zIndex={20}
      >
        <IconButton
          variant="outline"
          onClick={onOpen}
          aria-label="open menu"
          icon={<FiMenu />}
        />
        <Text
          fontSize="xl"
          fontWeight="bold"
          ml={4}
          color={useColorModeValue('blue.600', 'blue.400')}
        >
          MobileMart
        </Text>
      </Box>

      {/* Sidebar */}
      <Box display={{ base: 'none', md: 'block' }} w={60}>
        <SidebarContent display={{ base: 'none', md: 'block' }} />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box ml={{ base: 0, md: 60 }} pt={{ base: 16, md: 0 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
