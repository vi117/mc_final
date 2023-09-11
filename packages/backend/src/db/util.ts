import debug_namespace from "debug";
import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "../../dist/db.js";

const pool = createPool({
  uri: process.env.DATABASE_URL,
});

const db = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: pool,
  }),
});

function testDBConnection() {
  const debug = debug_namespace("joinify:db");
  pool.query("SELECT 1+1", (err, _res) => {
    if (err) {
      debug(err);
    } else {
      debug("successfully connected to db");
    }
  });
}

testDBConnection();

export { DB, db };
