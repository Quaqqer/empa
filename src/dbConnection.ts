import * as fs from "fs/promises";
import path from "path";

const migrationFilename = /([1-9]\d*)_.*\.sql/;

import BetterSqlite3, { Database } from "better-sqlite3";

function createDb(): Database {
  const dbPath = "db.sqlite";
  return new BetterSqlite3(dbPath);
}

function dbVer(db: Database): number {
  return db.pragma("user_version", { simple: true });
}

async function migrateDb(db: Database): Promise<void> {
  const migrationsDir = "./src/migrations";

  // Find all migration files
  const migrationFiles = (await fs.readdir(migrationsDir).then((fileNames) =>
    fileNames
      .map((fileName) => {
        const match = migrationFilename.exec(fileName);
        return match ? { fileName, i: Number(match[1]) } : undefined;
      })
      .filter((v) => v !== undefined)
  )) as { fileName: string; i: number }[];

  // Make it an array, error if duplicate indexes are found
  const migrationsIm: (string | undefined)[] = [];
  for (const m of migrationFiles) {
    // Offset it by 1 since migration 1 corresponds to the first element (0)
    const i = m.i - 1;
    if (migrationsIm[i] !== undefined)
      throw Error(
        `Duplicate migration, '${migrationsIm[i]}' and '${m.fileName}' cause a collision.`
      );
    else migrationsIm[i] = m.fileName;
  }

  // Check so that the array is filled from start to finish
  if (migrationsIm.includes(undefined))
    throw Error(
      "There is a missing interval in the migrations list. " +
        "This happens when migration 0 and 2 exist, but not 1."
    );

  const migrations = migrationsIm as string[];

  // Execute all migrations necessary
  let migrated = false;
  for (let i = dbVer(db); i < migrations.length; i++) {
    migrated = true;
    const migrationNr = i + 1;

    const filePath = path.join(migrationsDir, migrations[i]);
    const migration = await fs.readFile(filePath, "utf-8");

    // Perform migration
    db.exec(migration);

    // Update version number
    db.pragma(`user_version = ${migrationNr}`);
  }

  if (migrated) console.log("Migrations ran successfully");
}

export { createDb, migrateDb };
