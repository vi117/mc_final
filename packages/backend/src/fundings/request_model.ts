import { DB } from "@/db/util";
import { Insertable, Kysely, Updateable } from "kysely";

export class FundingRequestsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAll({
    limit = 50,
    offset = 0,
  }) {
    return await this.db.selectFrom("funding_requests")
      .innerJoin("users as host", "funding_requests.host_id", "host.id")
      .select([
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
      ])
      .selectAll("funding_requests")
      .limit(limit)
      .offset(offset)
      .execute();
  }

  async findById(id: number) {
    return await this.db.selectFrom("funding_requests")
      .innerJoin("users as host", "funding_requests.host_id", "host.id")
      .select([
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
      ])
      .where("funding_requests.id", "=", id).selectAll("funding_requests")
      .executeTakeFirst();
  }

  async insert(funding: Insertable<DB["funding_requests"]>): Promise<number> {
    const ret = await this.db.insertInto("funding_requests")
      .values(funding)
      .returning(["id"])
      .executeTakeFirstOrThrow();
    return ret?.id;
  }

  /**
   * Updates a record in the "funding_requests" table by its ID.
   * if the record does not exist, an error is thrown.
   *
   * @param {number} id - The ID of the record to update.
   * @param {Updateable<DB["funding_requests"]>} funding - The updated data for the record.
   * @return {Promise<void>} - A promise that resolves when the update is complete.
   */
  async updateById(id: number, funding: Updateable<DB["funding_requests"]>) {
    await this.db
      .updateTable("funding_requests")
      .set({
        ...funding,
        updated_at: new Date(),
      })
      .where("funding_requests.id", "=", id)
      .executeTakeFirstOrThrow();
  }
}
