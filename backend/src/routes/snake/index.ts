import { PostSnakeScore as PostSnakeScoreType } from "empa-schemas";
import * as PostSnakeScore from "empa-schemas/schemas/PostSnakeScore.json";
import * as SnakeScores from "empa-schemas/schemas/SnakeScores.json";
import { FastifyPluginAsync } from "fastify";

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
