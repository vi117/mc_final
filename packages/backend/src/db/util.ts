import debug_namespace from "debug";
import { Kysely, MysqlDialect, sql } from "kysely";
import { createPool } from "mysql2";
import { DB } from "../../dist/db.js";

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
 * Starts a transaction.
 * It is for unit testing.
 * @example
 * ```ts
 * import { beginTransaction } from "./util";
 * const [trx, close] = await beginTransaction();
 * trx.execute();
 * close();
 * ```
 */
export function beginTransaction(): Promise<() => void> {
  const original = getDB();
  const trx_builder = original.transaction();
  let dispose_fn: () => void;
  const close_promise = new Promise<void>((resolve, _reject) => {
    dispose_fn = resolve;
  });
  return new Promise((resolve, _reject) => {
    trx_builder.execute(async trx => {
      db = trx;
      resolve(dispose_fn);
      // transaction started
      await close_promise;
      // transaction closed
      db = original;
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

function testDBConnection() {
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

testDBConnection();

export { DB };
