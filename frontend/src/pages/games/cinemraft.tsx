import Head from "next/head";

import _CineMraft from "../../games/cinemraft";

export default function CineMraft(): JSX.Element {
  return (
    <>
      <Head>
        <title>CineMraft</title>
      </Head>

      <_CineMraft />
    </>
  );
}
