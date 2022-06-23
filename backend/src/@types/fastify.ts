import { Database } from "better-sqlite3";
import { Env } from "empa-schemas";

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
    config: Env;
  }
}
