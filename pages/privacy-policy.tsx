import Head from 'next/head';
import { Box, Heading, Text } from '@chakra-ui/react';

const PrivacyPolicy = () => {
  return (
    <Box px={8} py={12} maxW="800px" mx="auto">
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <Heading as="h1" mb={6}>
        Privacy Policy
      </Heading>
      <Text mb={4}>
        At Pictioner, we are committed to protecting your privacy. We understand that privacy is important, and we want you to feel confident that any information you provide to us is secure.
      </Text>
      <Heading as="h2" fontSize="xl" mt={8} mb={4}>
        Information Collection
      </Heading>
      <Text mb={4}>
        We would like to assure you that we do not collect any personally identifiable information (PII) about you as you browse our website.
      </Text>
      <Heading as="h2" fontSize="xl" mt={8} mb={4}>
        Use of Cookies
      </Heading>
      <Text mb={4}>
        We do not use any cookies or tracking technologies to collect information about your browsing behavior on our website. 
      </Text>
      <Text>
        We do log some basic telemetry related to button click like when you click on the Start Game button. This is strictly done to help us understand how our users interact with our website and improve the user experience.
        The statistics are anonymized and do not contain any personally identifiable information.
      </Text>
      <Heading as="h2" fontSize="xl" mt={8} mb={4}>
        Third-Party Links
      </Heading>
      <Text mb={4}>
        Our website may contain links to third-party websites. Please note that we have no control over the content or privacy practices of those sites, and we encourage you to review their respective privacy policies.
      </Text>
      <Heading as="h2" fontSize="xl" mt={8} mb={4}>
        Changes to This Privacy Policy
      </Heading>
      <Text mb={4}>
        We reserve the right to update or change our privacy policy at any time. Any updates or changes will be posted on this page.
      </Text>
      <Heading as="h2" fontSize="xl" mt={8} mb={4}>
        Contact Us
      </Heading>
      <Text mb={4}>
        If you have any questions or concerns regarding our privacy policy, please contact the developer at priyankar.kumar98@gmail.com
      </Text>
    </Box>
  );
};

export default PrivacyPolicy;
