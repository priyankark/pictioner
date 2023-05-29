import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box
      bg="purple.400"
      py={8}
      textAlign="center"
      boxShadow="xl"
    >
      <Heading
        as="h1"
        size="2xl"
        color="white"
        fontFamily="Poppins, sans-serif"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wide"
        mb={4}
      >
        Pictioner
      </Heading>
    </Box>
  );
};

export default Header;