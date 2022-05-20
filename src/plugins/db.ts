import { FastifyPluginAsync } from "fastify";

import { createDb, migrateDb } from "../dbConnection";

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const db = await createDb();
  migrateDb(db);

  fastify.decorate("db", db);

  fastify.addHook("onReady", async () => {
    fastify.db.close();
  });
};

export default dbPlugin;
