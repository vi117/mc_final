import { DB } from "@/db/util";
import { Insertable, Kysely } from "kysely";

export class FundingsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAll() {
    return await this.db.selectFrom("fundings").selectAll().execute();
  }

  async insert(funding: Insertable<DB["fundings"]>): Promise<bigint | undefined> {
    const ret = await this.db.insertInto("fundings").values(funding).executeTakeFirst();
    return ret.insertId;
  }
}
