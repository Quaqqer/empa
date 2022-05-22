import { Database } from "better-sqlite3";

import { Env } from "../types/Env";

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
    config: Env;
  }
}
