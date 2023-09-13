import { DB } from "@/db/util";
import { Insertable, Kysely } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/mysql";

export interface FindAllUsersOptions {
  limit?: number;
  offset?: number;
  cursor?: number;
  user_id?: number;
}

export interface FundingRewards {
  id: number;
  funding_id: number | null;
  title: string;
  content: string;
  price: number;
  reward_count: number;
  reward_current_count: number;
  created_at: Date;
  deleted_at: Date | null;
}

export interface FundingObject {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
  target_value: number;
  current_value: number;
  begin_date: Date;
  end_date: Date;

  host_id: number;

  host_nickname: string;
  host_profile_image: string | null;
  host_email: string;
  interest_funding_id: number | null;

  tags: {
    tag: string;
  }[];
}

export class FundingsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAll(options?: FindAllUsersOptions): Promise<FundingObject[]> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const cursor = options?.cursor;
    const user_id = options?.user_id ?? null;

    const query = this.db.selectFrom("fundings")
      .innerJoin("users as host", "fundings.host_id", "host.id")
      .leftJoin("user_funding_interest as interest", join =>
        join
          .onRef("interest.funding_id", "=", "fundings.id")
          .on("interest.user_id", "=", user_id))
      .selectAll(["fundings"])
      .select([
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
        "interest.funding_id as interest_funding_id",
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb.selectFrom("funding_tag_rel")
            .innerJoin("funding_tags", "funding_tag_rel.tag_id", "funding_tags.id")
            .whereRef("funding_tag_rel.funding_id", "=", "fundings.id")
            .select(["funding_tags.tag as tag"]),
        ).as("tags"),
      ])
      .$if(cursor !== undefined, (qb) => qb.where("id", "<", cursor ?? 0))
      .limit(limit)
      .offset(offset);

    const rows = await query.execute();
    return rows;
  }

  /**
   * Retrieves a funding object from the database based on the given ID.
   *
   * @param {number} id - The ID of the funding object to retrieve.
   * @return {Promise<FundingObject | undefined>} A promise that resolves to the retrieved funding object, or undefined if not found.
   */
  async findById(id: number): Promise<
    FundingObject & {
      rewards: FundingRewards[];
    } | undefined
  > {
    const ret = await this.db.selectFrom("fundings")
      .innerJoin("users as host", "fundings.host_id", "host.id")
      .leftJoin("user_funding_interest as interest", join =>
        join
          .onRef("interest.funding_id", "=", "fundings.id")
          .on("interest.user_id", "=", id))
      .selectAll(["fundings"])
      .select([
        "host.id as host_id",
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
        "interest.funding_id as interest_funding_id",
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb.selectFrom("funding_tag_rel")
            .innerJoin("funding_tags", "funding_tag_rel.tag_id", "funding_tags.id")
            .whereRef("funding_tag_rel.funding_id", "=", "fundings.id")
            .select(["funding_tags.tag as tag"]),
        ).as("tags"),
        jsonArrayFrom(
          eb.selectFrom("funding_rewards")
            .whereRef("funding_rewards.funding_id", "=", "fundings.id")
            .selectAll(),
        ).as("rewards"),
      ])
      .where("fundings.id", "=", id)
      .executeTakeFirst();
    return ret;
  }

  async insert(funding: Insertable<DB["fundings"]>): Promise<bigint | undefined> {
    const ret = await this.db.insertInto("fundings").values(funding).executeTakeFirst();
    return ret.insertId;
  }
}
