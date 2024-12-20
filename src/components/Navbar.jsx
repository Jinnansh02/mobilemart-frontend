import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Badge,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { UserCircle, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Links = ['Products', 'Favorite-Products'];

const NavLink = (props) => {
  const { children } = props;
  return (
    <Box
      as={Link}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      to={`/${children?.toLowerCase()}`}
    >
      {children}
    </Box>
  );
};

const CartIcon = () => {
  const { cart } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Box position="relative" cursor="pointer" onClick={() => navigate('/cart')}>
      <ShoppingCart size={20} />
      {cartItemCount > 0 && (
        <Badge
          position="absolute"
          top="-10px"
          left="2px"
          colorScheme="blue"
          borderRadius="full"
          minW="18px"
          height="18px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="bold"
        >
          {cartItemCount}
        </Badge>
      )}
    </Box>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box as={Link} to={'/'} fontWeight="bold">
            Mobile Mart
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link?.toLowerCase()}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'} gap={4}>
          {/* Cart Icon */}
          <Box
            as={Button}
            variant="ghost"
            p={2}
            _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
          >
            <CartIcon />
          </Box>

          {!isAuthenticated ? (
            <Button
              as={Link}
              to={'/login'}
              variant={'solid'}
              colorScheme="blue"
              size={'sm'}
              mr={4}
            >
              Login
            </Button>
          ) : (
            <Menu>
              <MenuButton
                as={Button}
                variant={'ghost'}
                cursor={'pointer'}
                minW={0}
                leftIcon={<UserCircle size={20} />}
              >
                {user?.name}
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem as={Link} to="/orders">
                  My Orders
                </MenuItem>
                <MenuItem as={Link} to="/favorite-products">
                  Favorite Products
                </MenuItem>
                <MenuDivider />
                {user?.role?.includes('admin') && (
                  <>
                    <MenuItem as={Link} to="/admin/categories">
                      Admin Dashboard
                    </MenuItem>
                    <MenuDivider />
                  </>
                )}
                <MenuItem onClick={handleLogout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
