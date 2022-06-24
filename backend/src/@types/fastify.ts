import { Database } from "better-sqlite3";
import { FastifyEnv } from "empa-schemas";

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
    config: FastifyEnv;
  }
}
