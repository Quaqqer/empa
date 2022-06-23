import Head from "next/head";

import _GameOfLife from "../../components/games/GameOfLife";

export default function GameOfLife(): JSX.Element {
  return (
    <>
      <Head>
        <title>Game of Life</title>
      </Head>

      <_GameOfLife />
    </>
  );
}
