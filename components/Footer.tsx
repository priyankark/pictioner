import { Box, Link, Text, VStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" py={8} px={4} bg="gray.200">
      <VStack spacing={4}>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Text>
          &copy; {new Date().getFullYear()} Priyankar Kumar |{' '}
          <Link href="https://priyankar.me" isExternal>
            priyankar.me
          </Link>
        </Text>
        <Link href="https://www.buymeacoffee.com/priyankark" isExternal>
          <img
            src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=priyankark&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff"
            alt="Buy Me a Coffee"
            style={{ height: 'auto', width: 'auto' }}
          />
        </Link>
      </VStack>
    </Box>
  );
};

export default Footer;