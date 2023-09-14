import debug_namespace from "debug";
import { Kysely, MysqlDialect, sql } from "kysely";
import { createPool } from "mysql2";
import { DB } from "../../dist/db";

let db: Kysely<DB> | null = null;

export function createDB(): Kysely<DB> {
  const pool = createPool({
    uri: process.env.DATABASE_URL,
  });
  const db = new Kysely<DB>({
    dialect: new MysqlDialect({
      pool: pool,
    }),
  });
  return db;
}

export function getDB(): Kysely<DB> {
  if (!db) {
    db = createDB();
  }
  return db;
}

/**
 * Executes a transaction in a safe manner.
 *
 * @param {Function} fn - The function to be executed within the transaction.
 * @returns {Promise<T>} return - The result of executing the function within the transaction.
 */
export async function safeTransaction<T>(
  fn: (_trx: Kysely<DB>) => Promise<T>,
): Promise<T> {
  const db = getDB();
  if (db.isTransaction) {
    return await fn(db);
  }
  return await getDB().transaction().execute(fn);
}

/**
 * Starts a transaction.
 * It is for unit testing.
 * @example
 * ```ts
 * import { beginTransaction } from "./util";
 * const close = await beginTransaction();;
 * close();
 * ```
 */
export function beginTransaction(): Promise<
  (_c: "rollback" | "commit") => void
> {
  const original = getDB();
  const trx_builder = original.transaction();
  let dispose_fn: (_c: "rollback" | "commit") => void;
  const close_promise = new Promise<"rollback" | "commit">(
    (resolve, _reject) => {
      dispose_fn = resolve;
    },
  );
  return new Promise((resolve, reject) => {
    trx_builder.execute(async trx => {
      db = trx;
      resolve(dispose_fn);
      // transaction started
      const b = await close_promise;
      db = original;
      if (b === "rollback") {
        throw new Error("rollback");
      }
      // transaction closed
    }).catch((err) => {
      if (err instanceof Error && err.message === "rollback") {
        console.log("rollback");
        return;
      }
      reject(err);
    });
  });
}

/**
 * Disconnects from the database.
 * It is for unit testing.
 *
 * @return {void} This function does not return a value.
 */
export function disconnectDB() {
  db?.destroy();
  db = null;
}

export function testDBConnection() {
  const debug = debug_namespace("joinify:db");

  const db = getDB();
  const stmt = sql`SELECT 1+1`;
  stmt.execute(db).then((_res) => {
    debug("successfully connected to db");
  })
    .catch((err) => {
      debug(err);
    });
}

export { DB };
