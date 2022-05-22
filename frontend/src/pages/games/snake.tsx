import { GetServerSideProps } from "next";

import Snake, { SnakeProps } from "../../components/games/Snake";

export default Snake;

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
