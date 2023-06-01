import React, { useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    useToast,
    useColorModeValue,
    Heading,
    Text,
    Flex,
    Image,
    Slide,
    SlideFade,
    useDisclosure,
} from '@chakra-ui/react';
import va from '@vercel/analytics';
import { FaComment, FaShare, FaArrowLeft, FaTimes } from 'react-icons/fa';

export const FeedbackCapture = () => {
    const [feedbackType, setFeedbackType] = useState('');
    const toast = useToast();
    const bg = useColorModeValue('gray.100', 'gray.700');
    const [isVoted, setIsVoted] = useState(false);
    const { isOpen, onToggle, onClose } = useDisclosure();

    const handleFeedback = (type: string) => {
        setFeedbackType(type);
        setIsVoted(true);
        switch (type) {
            case 'positive':
                va.track('feedback-positive');
                toast({
                    title: 'Thanks for your feedback!',
                    description: 'We appreciate your positive feedback.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                break;
            case 'neutral':
                va.track('feedback-neutral');
                toast({
                    title: 'Thanks for your feedback!',
                    description: 'We will take your feedback into consideration.',
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                });
                break;
            case 'negative':
                va.track('feedback-negative');
                toast({
                    title: 'Thanks for your feedback!',
                    description: 'We apologize for any inconvenience caused.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Box
                position="fixed"
                top="50%"
                right="0"
                transform="translateY(-50%)"
                zIndex="999"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Box
                    bg="purple.400"
                    boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                    borderRadius="md"
                    padding="4"
                    margin="2"
                    cursor="pointer"
                    _hover={{ bg: 'green.500', color: 'white' }}
                    transition="background-color 0.2s ease-in-out"
                    onClick={onToggle}
                >
                    <FaComment color="white" size={32} />
                </Box>
                <Box
                    bg="purple.400"
                    boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                    borderRadius="md"
                    padding="4"
                    margin="2"
                    cursor="pointer"
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    transition="background-color 0.2s ease-in-out"
                    onClick={() => {
                        window.open('https://twitter.com/intent/tweet?url=pictioner.com', '_blank');
                    }}
                >
                    <FaShare color="white" size={32} />
                </Box>
            </Box>
            <SlideFade in={isOpen} offsetY="-20px">
                <Box
                    bg={bg}
                    py={8}
                    position="fixed"
                    top="50%"
                    right="0"
                    transform="translateY(-50%)"
                    zIndex="9999"
                    onClick={onClose}
                >
                    <Box
                        bg="white"
                        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                        borderRadius="md"
                        padding="4"
                        margin="2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Flex justifyContent="space-between" alignItems="center" mb={4}>
                            <Heading as="h2" size="md">
                                How was your experience?
                            </Heading>
                            <Button size="sm" onClick={onClose}>
                                <FaTimes />
                            </Button>
                        </Flex>
                        <ButtonGroup spacing={4}>
                            <Button
                                leftIcon={<FaComment />}
                                colorScheme="green"
                                onClick={() => handleFeedback('positive')}
                            >
                                Positive
                            </Button>
                            <Button
                                leftIcon={<FaComment />}
                                colorScheme="white"
                                backgroundColor={'purple.500'}
                                onClick={() => handleFeedback('neutral')}
                            >
                                Neutral
                            </Button>
                            <Button
                                leftIcon={<FaComment />}
                                colorScheme="red"
                                onClick={() => handleFeedback('negative')}
                            >
                                Negative
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Box>
            </SlideFade>
        </>
    );
};