import { Text } from "@chakra-ui/react";
import Head from "next/head";

import Hero from "../components/Hero";

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>empa.xyz</title>
      </Head>

      <Hero>Welcome</Hero>

      <Text mx={2}>
        Welcome to my website. I haven{"'"}t put a lot of stuff here yet, but I
        had fun making what is here. Please check out my Snake and Game of Life.
        Try to beat my high score in Snake, if you can. {";)"}
      </Text>
    </>
  );
}
