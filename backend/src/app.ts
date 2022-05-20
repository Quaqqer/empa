import { join } from "path";

import autoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Load all plugins/
  fastify.register(autoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // Load all routes/
  fastify.register(autoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
