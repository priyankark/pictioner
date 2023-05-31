import { Box, Flex, Link, Text, VStack } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box as="footer" py={8} px={4} bg="gray.200">
            <VStack spacing={4}>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Text>
                    <center>
                        <strong>Notice:</strong> GPT costs money. The developer can afford to run this website for free for a limited time only per month. If you like this website, please consider donating to help keep it running.
                        <br />Or Self-host: <Link href="https://github.com/priyankark/pictioner" color={"blue"} isExternal>Get the source code</Link>
                    </center>
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
                            <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=397158&theme=light" alt="Pictioner - Test&#0032;your&#0032;wits&#0032;against&#0032;GPT&#0045;4&#0032;in&#0032;a&#0032;fun&#0032;art&#0032;guessing&#0032;game | Product Hunt" style={{ width: "250px", height: "54px" }} width="250" height="54" />
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