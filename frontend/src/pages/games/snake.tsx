import { GetServerSideProps } from "next";
import Head from "next/head";

import _Snake, { SnakeProps } from "../../components/games/Snake";

type SnakePageProps = {
  scores: SnakeProps["scores"];
};

export default function Snake({ scores }: SnakePageProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Snake</title>
      </Head>

      <_Snake scores={scores} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<SnakeProps> = async () => {
  const response = await fetch("http://localhost:5000/snake/leaderboard");

  if (!response.ok) throw Error("Could not get leaderboard");

  const json = await response.json();

  return {
    props: {
      scores: json,
    },
  };
};
