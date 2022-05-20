import { FastifyPluginAsync } from "fastify";

import * as PostSnakeScore from "../../schemas/PostSnakeScore.json";
import * as SnakeScores from "../../schemas/SnakeScores.json";
import { PostSnakeScore as PostSnakeScoreType } from "../../types/PostSnakeScore";

const snakePlugin: FastifyPluginAsync = async (fastify) => {
  const getScores = fastify.db.prepare("SELECT name, score FROM SnakeScores");
  const putScore = fastify.db.prepare(
    "INSERT INTO SnakeScores (name, score) VALUES (?, ?)"
  );

  fastify.get("/scores", {
    schema: { response: { 200: SnakeScores } },
    handler: async () => {
      return getScores.all();
    },
  });

  fastify.post("/scores", {
    schema: { body: PostSnakeScore },
    handler: (request, reply) => {
      const json = request.body as PostSnakeScoreType;
      putScore.run(json.name, json.score);

      reply.send();
    },
  });
};

export default snakePlugin;
