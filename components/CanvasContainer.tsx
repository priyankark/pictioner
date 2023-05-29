import { Box } from '@chakra-ui/react';
import React from 'react';

const CanvasContainer = ({ children }: { children: JSX.Element }) => {
    return (
        <Box
            position="relative"
            width="500px"
            height="500px"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            overflow="hidden"
        >
            {children}
        </Box>
    );
};

export default CanvasContainer;