import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box
      bgGradient="linear(to-r, teal.100, cyan.100)"
      py={8}
      textAlign="center"
      boxShadow="md"
    >
      <Heading
        as="h1"
        size="2xl"
        color="teal.900"
        fontFamily="Poppins, sans-serif"
        letterSpacing="tight"
        fontWeight="bold"
      >
        Pictioner
      </Heading>
      <Heading
        as="h2"
        size="lg"
        color="gray.700"
        mt={4}
        fontFamily="Poppins, sans-serif"
      >
        Play Pictionary Against GPT-4
      </Heading>
    </Box>
  );
};

export default Header;
