import { DB } from "@/db/util";
import { Insertable, Kysely } from "kysely";

export class FundingRequestsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAll() {
    return await this.db.selectFrom("funding_requests")
      .innerJoin("users as host", "funding_requests.host_id", "host.id")
      .select([
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
      ])
      .selectAll("funding_requests").execute();
  }

  async insert(funding: Insertable<DB["funding_requests"]>): Promise<bigint | undefined> {
    const ret = await this.db.insertInto("funding_requests").values(funding).executeTakeFirst();
    return ret.insertId;
  }
}
