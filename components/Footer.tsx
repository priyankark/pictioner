import { Box, Flex, Link, Text, VStack } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box as="footer" py={8} px={4} bg="gray.200">
            <VStack spacing={4}>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Text>
                    <Flex direction="column" align="center" justify="center" gap={2}>
                        <Box>
                            <Link href="https://github.com/priyankark/pictioner" color={"blue"} isExternal>Get the source code</Link>
                        </Box>
                    </Flex>
                </Text>
                <Text>
                    &copy; {new Date().getFullYear()} Priyankar Kumar |{' '}
                    <Link href="https://priyankar.me" isExternal>
                        priyankar.me
                    </Link>
                </Text>
                <Flex direction="row" align="center" justify="center" gap={2}>
                    <Box>
                        <Link href="https://www.producthunt.com/posts/pictioner?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pictioner" isExternal>
                            <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=397158&theme=light" alt="Pictioner - Test your wits against GPT-4 in a fun art guessing game | Product Hunt" style={{ width: "250px", height: "54px" }} width="250" height="54" />
                        </Link>
                    </Box>
                    <Box>
                        <Link href="https://www.buymeacoffee.com/priyankark" isExternal>
                            <img
                                src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=priyankark&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff"
                                alt="Buy Me a Coffee"
                                style={{ height: 'auto', width: 'auto' }}
                            />
                        </Link>
                    </Box>
                </Flex>
            </VStack>
        </Box>
    );
};

export default Footer;