import { DB } from "@/db/util";
import {
  FundingMetaParsed,
  FundingRequestObject,
  FundingRewardInput,
} from "dto";
import { Insertable, Kysely, Updateable } from "kysely";

export { FundingMetaParsed, FundingRequestObject, FundingRewardInput };

export class FundingRequestsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAll({
    limit = 50,
    offset = 0,
    user_id = undefined,
  }: {
    limit?: number;
    offset?: number;
    user_id?: number;
  }): Promise<FundingRequestObject[]> {
    const ret = await this.db.selectFrom("funding_requests")
      .innerJoin("users as host", "funding_requests.host_id", "host.id")
      .select([
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
      ])
      .selectAll("funding_requests")
      .$if(
        user_id !== undefined,
        (qb) => qb.where("funding_requests.host_id", "=", user_id as number),
      )
      .limit(limit)
      .offset(offset)
      .orderBy("funding_requests.created_at", "desc")
      .execute();
    return ret.map((x) => ({
      ...x,
      meta_parsed: JSON.parse(x.meta || "null"),
    }));
  }

  async findById(id: number): Promise<FundingRequestObject | undefined> {
    const row = await this.db.selectFrom("funding_requests")
      .innerJoin("users as host", "funding_requests.host_id", "host.id")
      .select([
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
      ])
      .where("funding_requests.id", "=", id).selectAll("funding_requests")
      .executeTakeFirst();
    if (!row) return undefined;
    return ({
      ...row,
      meta_parsed: JSON.parse(row.meta || "null"),
    });
  }

  async insert(
    funding: Insertable<DB["funding_requests"]> & {
      meta_parsed?: FundingMetaParsed;
    },
  ): Promise<number | undefined> {
    if (funding.meta_parsed) {
      funding.meta = JSON.stringify(funding.meta_parsed);
      delete funding.meta_parsed;
    }
    const ret = await this.db.insertInto("funding_requests")
      .values(funding)
      .executeTakeFirstOrThrow();
    return Number(ret.insertId);
  }

  /**
   * Updates a record in the "funding_requests" table by its ID.
   * if the record does not exist, an error is thrown.
   *
   * @param {number} id - The ID of the record to update.
   * @param {Updateable<DB["funding_requests"]>} funding - The updated data for the record.
   * @return {Promise<void>} - A promise that resolves when the update is complete.
   */
  async updateById(
    id: number,
    funding: Updateable<DB["funding_requests"]> & {
      meta_parsed?: FundingMetaParsed;
    },
  ) {
    if (funding.meta_parsed) {
      funding.meta = JSON.stringify(funding.meta_parsed);
      delete funding.meta_parsed;
    }
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
