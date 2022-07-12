import { Link, Text } from "@chakra-ui/react";
import Head from "next/head";

import Hero from "../components/Hero";

export default function asd(): JSX.Element {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <Hero>About</Hero>

      <Hero size="medium">About me</Hero>

      <Text mx={2}>
        Hello! My name is Emanuel, and I am a student of software engineering in
        Sweden. I am interested in programming and systems programming.
      </Text>

      <Hero size="medium">About this site</Hero>

      <Text mx={2} mb={2}>
        This site was coded in TypeScript with the{" "}
        <Link href="https://nextjs.org/">Next.js</Link> framework. The framework
        uses the <Link href="https://reactjs.org/">React</Link> library, and I
        personally used the component library{" "}
        <Link href="https://chakra-ui.com/">chakra-ui</Link> for some minimal
        premade components React. To host the scoreboard for the site I used the{" "}
        <Link href="https://www.fastify.io/">Fastify</Link> framework to create
        api endpoints and the{" "}
        <Link href="https://github.com/WiseLibs/better-sqlite3">
          better-sqlite3
        </Link>{" "}
        library to store the scores locally in a database.
      </Text>

      <Text mx={2}>
        The source code for this site can be found{" "}
        <Link href="https://github.com/Quaqqer/empa">here</Link>.
      </Text>
    </>
  );
}
