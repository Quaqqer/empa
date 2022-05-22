import fastifyEnv from "@fastify/env";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import * as _Env from "../schemas/Env.json";

// Need to do this, otherwise it complains about getters
const Env = JSON.parse(JSON.stringify(_Env));
Env.default = undefined;

const envPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyEnv, { schema: Env });
};

export default fp(envPlugin, { name: "env" });
