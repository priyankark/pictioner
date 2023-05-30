import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import PictionaryLogo from '../public/pictioner_logo.gif'
import Image from 'next/image';

const MotionBox = motion(Box);

export const GameStart = () => {
    const bg = useColorModeValue('gray.100', 'gray.700');
    const shadow = useColorModeValue('0 2px 4px rgba(0, 0, 0, 0.1)', 'none');

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            height={"50vh"}
        >
            <MotionBox
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                bg="white"
                boxShadow={shadow}
                borderRadius="half"
                padding="4"
                margin="2"
                position="absolute"
            >
                <Image src={PictionaryLogo} alt="pictionary" height={800} />
            </MotionBox>
        </Box>
    );
};