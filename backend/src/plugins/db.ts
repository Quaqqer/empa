import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { createDb, migrateDb } from "../dbConnection";

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const db = createDb();
  await migrateDb(db);

  fastify.decorate("db", db);

  fastify.addHook("onClose", async () => {
    fastify.db.close();
  });
};

export default fp(dbPlugin);
