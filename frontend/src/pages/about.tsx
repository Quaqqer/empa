import Head from "next/head";

import Hero from "../components/Hero";

export default function asd(): JSX.Element {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <Hero>About</Hero>
      {"Well, this is awkward. I don't have a lot to share right now."}
    </>
  );
}
