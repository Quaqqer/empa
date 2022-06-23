import { XPlusY } from "empa-schemas";
import * as XPlusYSchema from "empa-schemas/schemas/xPlusY.json";
import { FastifyPluginAsync } from "fastify";

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
