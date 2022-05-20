import { Button, Center, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import NLink from "next/link";
import { ReactElement } from "react";

export default function E404(): ReactElement {
  return (
    <>
      <Head>
        <title>404: Page not found</title>
      </Head>

      <Center my={10}>
        <Heading width={700}>Error 404: This page could not be found</Heading>
      </Center>

      <Center>
        <Text width={600}>
          The contents of this page are missing. The page may have been deleted
          or it never existed to begin with.
        </Text>
      </Center>

      <Center>
        <NLink href="/" passHref>
          <Button m={10}>Go back to home</Button>
        </NLink>
      </Center>
    </>
  );
}
