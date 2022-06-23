import fastifyEnv from "@fastify/env";
import * as _Env from "empa-schemas/schemas/Env.json";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

// Need to do this, otherwise it complains about getters
const Env = JSON.parse(JSON.stringify(_Env));
Env.default = undefined;

const envPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyEnv, { schema: Env });
};

export default fp(envPlugin, { name: "env" });
