import { Box, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>empa.xyz</title>
      </Head>

      <Box>
        <Heading>Hej hej</Heading>

        <Text>Hej där på dig</Text>
      </Box>
    </>
  );
}
