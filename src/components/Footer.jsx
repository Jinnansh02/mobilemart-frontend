import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Input,
  Button,
  IconButton,
  Link,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import {
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';

const SocialButton = ({ children, label, href }) => {
  return (
    <IconButton
      bg="whiteAlpha.100"
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: 'whiteAlpha.300',
      }}
    >
      {children}
    </IconButton>
  );
};

const Footer = () => {
  return (
    <Box bg="gray.900" color="gray.200">
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
          spacing={8}
        >
          {/* Logo and Description Section */}
          <Stack spacing={6}>
            <Text fontSize={'2xl'} fontWeight="bold" color="white">
              MobileMart
            </Text>
            <Text fontSize={'sm'} color="gray.400">
              Your one-stop destination for mobile devices and accessories. We
              provide quality products with exceptional service.
            </Text>
            <HStack spacing={4}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter color="white" />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'#'}>
                <FaYoutube color="white" />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <FaInstagram color="white" />
              </SocialButton>
              <SocialButton label={'LinkedIn'} href={'#'}>
                <FaLinkedin color="white" />
              </SocialButton>
            </HStack>
          </Stack>

          {/* Company Links */}
          <Stack align={'flex-start'}>
            <Text color="white" fontWeight="500" fontSize="lg" mb={2}>
              Company
            </Text>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              About us
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Blog
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Contact us
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Pricing
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Testimonials
            </Link>
          </Stack>

          {/* Support Links */}
          <Stack align={'flex-start'}>
            <Text color="white" fontWeight="500" fontSize="lg" mb={2}>
              Support
            </Text>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Help Center
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Terms of Service
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Legal
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Privacy Policy
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Status
            </Link>
          </Stack>

          {/* Newsletter and Contact */}
          <Stack align={'flex-start'}>
            <Text color="white" fontWeight="500" fontSize="lg" mb={2}>
              Stay up to date
            </Text>
            <Stack direction={'row'} width="100%">
              <Input
                placeholder={'Your email address'}
                bg="whiteAlpha.100"
                border={0}
                _placeholder={{ color: 'gray.400' }}
                _focus={{
                  bg: 'whiteAlpha.300',
                }}
              />
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Subscribe
              </Button>
            </Stack>
            <VStack spacing={3} align={'flex-start'} color="gray.400">
              <HStack>
                <FaMapMarkerAlt />
                <Text>400 King St S, Kitchener</Text>
              </HStack>
              <HStack>
                <FaPhone />
                <Text>+1 (555) 123-4567</Text>
              </HStack>
              <HStack>
                <FaEnvelope />
                <Text>contact@mobilemart.com</Text>
              </HStack>
            </VStack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Divider borderColor="gray.800" />

      <Box py={4} bg="gray.900">
        <Container
          as={Stack}
          maxW={'6xl'}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text color="gray.400">© 2024 MobileMart. All rights reserved</Text>
          <HStack spacing={6}>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Terms
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Privacy
            </Link>
            <Link href={'#'} color="gray.400" _hover={{ color: 'white' }}>
              Cookies
            </Link>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
