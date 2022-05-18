import { FastifyPluginAsync } from "fastify";

import * as XPlusYSchema from "../../schemas/xPlusY.json";
import { XPlusY } from "../../types/xPlusY";

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          x: { type: "number" },
          y: { type: "number" },
        },
        required: ["x"],
      },
    },
    handler: async (_request) => {
      return "hej";
    },
  });

  fastify.post("/login", {
    schema: { body: XPlusYSchema },
    handler: async (request) => {
      const json = request.body as XPlusY;
      return (json.x + json.y).toString();
    },
  });
};

export default root;
