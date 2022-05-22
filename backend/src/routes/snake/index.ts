import { FastifyPluginAsync } from "fastify";

import * as PostSnakeScore from "../../schemas/PostSnakeScore.json";
import * as SnakeScores from "../../schemas/SnakeScores.json";
import { PostSnakeScore as PostSnakeScoreType } from "../../types/PostSnakeScore";

const snakePlugin: FastifyPluginAsync = async (fastify) => {
  const getLeaderboard = fastify.db.prepare(
    "SELECT name, score, rowid as id FROM SnakeScores ORDER BY score DESC LIMIT 10"
  );
  const putScore = fastify.db.prepare(
    "INSERT INTO SnakeScores (name, score) VALUES (?, ?)"
  );

  fastify.get("/leaderboard", {
    schema: { response: { 200: SnakeScores } },
    handler: async () => {
      return getLeaderboard.all();
    },
  });

  fastify.post("/score", {
    schema: { body: PostSnakeScore },
    handler: (request, reply) => {
      const json = request.body as PostSnakeScoreType;
      putScore.run(json.name, json.score);

      reply.send();
    },
  });
};

export default snakePlugin;
