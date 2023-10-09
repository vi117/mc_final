import { DB, log_query } from "@/db/util";
import debug_fn from "debug";
import {
  FundingObject,
  FundingReportObject,
  FundingRewards,
  FundingUserObject,
} from "dto";
import { Insertable, Kysely, Updateable } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/mysql";

export { FundingObject, FundingReportObject, FundingRewards };

const debug = debug_fn("joinify:db");

export interface FindAllUsersOptions {
  limit?: number;
  offset?: number;
  cursor?: number;
  /**
   * 사용자 ID
   */
  user_id?: number;
  /**
   * Specifies the start date for a funding search.
   * The date from which to begin the search.
   * @default Date.now()
   */
  begin_date?: Date;
  /**
   * end_date
   * @default Date.now()
   */
  end_date?: Date;
  /**
   * include_deleted
   * @default false
   */
  include_deleted?: boolean;
  /**
   * tags to search
   */
  tags?: string[];
  /**
   * host filter
   */
  host_id?: number;
  /**
   * interest
   */
  interest?: boolean;
  /**
   * participated filter
   */
  participated?: boolean;
  /**
   * user reviewed(or not) funding filter
   */
  reviewed?: "reviewed" | "not_reviewed";
  /**
   * title
   */
  title?: string;
}

export interface FindOneOptions {
  user_id?: number;
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
    const begin_date = options?.begin_date;
    const end_date = options?.end_date ?? new Date();
    const include_deleted = options?.include_deleted ?? false;
    const tags = options?.tags;
    const host_id = options?.host_id;
    const interest = options?.interest;
    const participated = options?.participated;
    const reviewed = options?.reviewed;
    const title = options?.title;

    const query = this.db.selectFrom("fundings")
      .innerJoin("users as host", "fundings.host_id", "host.id")
      .$if(user_id !== null, (qb) =>
        interest
          ? qb.innerJoin(
            "user_funding_interest as interest",
            (join) =>
              join
                .onRef("interest.funding_id", "=", "fundings.id")
                .on("interest.user_id", "=", user_id),
          )
            .select([
              "interest.user_id as interest_user_id",
            ])
          : qb.leftJoin(
            "user_funding_interest as interest",
            (join) =>
              join
                .onRef("interest.funding_id", "=", "fundings.id")
                .on("interest.user_id", "=", user_id),
          )
            .select([
              "interest.user_id as interest_user_id",
            ]))
      .$if(user_id !== undefined, (qb) => {
        if (reviewed === "reviewed") {
          // user reviewed article
          return qb.innerJoin(
            "articles",
            "fundings.id",
            "articles.related_funding_id",
          )
            .where("articles.related_funding_id", "=", user_id)
            .select([
              "articles.id as reviewed_article_id",
            ]);
        } else {
          // user not reviewed article
          return qb.leftJoin(
            "articles",
            "fundings.id",
            "articles.related_funding_id",
          )
            .$if(reviewed === "not_reviewed", (qb) => {
              return qb.where("articles.related_funding_id", "is", null);
            })
            .select([
              "articles.id as reviewed_article_id",
            ]);
        }
      })
      .$if(user_id !== null, (qb) =>
        participated
          ? qb.innerJoin(
            "funding_users",
            (join) =>
              join.onRef("funding_users.funding_id", "=", "fundings.id")
                .on("funding_users.user_id", "=", user_id),
          )
            .select([
              "funding_users.reward_id as participated_reward_id",
            ])
          : qb.leftJoin(
            "funding_users",
            (join) =>
              join.onRef("funding_users.funding_id", "=", "fundings.id")
                .on("funding_users.user_id", "=", user_id),
          )
            .select([
              "funding_users.reward_id as participated_reward_id",
            ]))
      .$if(tags !== undefined, (qb) => {
        tags?.forEach((tag, index) => {
          qb = qb.innerJoin(
            `funding_tag_rel as f${index}`,
            `f${index}.funding_id`,
            "fundings.id",
          )
            .innerJoin(
              `funding_tags as t${index}`,
              `t${index}.id`,
              `f${index}.tag_id`,
            )
            .where(`t${index}.tag`, "=", tag) as unknown as typeof qb;
        });
        return qb;
      })
      .$if(title !== undefined, (qb) => {
        return qb.where("fundings.title", "like", `%${title}%`);
      })
      .select([
        "fundings.id",
        "fundings.title",
        "fundings.thumbnail",
        "fundings.content_thumbnails",
        "fundings.created_at",
        "fundings.updated_at",
        "fundings.deleted_at",
        "fundings.host_id",
        "fundings.target_value",
        "fundings.current_value",
        "fundings.begin_date",
        "fundings.end_date",
        "fundings.funding_request_id",
      ])
      .select([
        "host.id as host_id",
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
        "host.introduction as host_introduction",
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb.selectFrom("funding_tag_rel")
            .innerJoin(
              "funding_tags",
              "funding_tag_rel.tag_id",
              "funding_tags.id",
            )
            .whereRef("funding_tag_rel.funding_id", "=", "fundings.id")
            .select(["funding_tags.tag as tag", "funding_tags.id as id"]),
        ).as("tags"),
      ])
      .$if(cursor !== undefined, (qb) => qb.where("id", "<", cursor ?? 0))
      .$if(
        !include_deleted,
        (qb) => qb.where("fundings.deleted_at", "is", null),
      )
      .where("fundings.begin_date", "<", end_date)
      .$if(
        begin_date !== undefined,
        (qb) => qb.where("fundings.end_date", "<=", begin_date ?? new Date()),
      )
      .$if(
        host_id !== undefined,
        (qb) => qb.where("fundings.host_id", "=", host_id ?? null),
      )
      .limit(limit)
      .offset(offset)
      .orderBy("fundings.created_at", "desc")
      .$call(log_query(debug));

    const rows = await query.execute();
    return rows.map((row) => ({
      ...row,
      content: "",
      content_thumbnails: JSON.parse(row.content_thumbnails) as string[],
    }));
  }

  /**
   * Retrieves a funding object from the database based on the given ID.
   *
   * @param {number} id - The ID of the funding object to retrieve.
   * @param {FindOneOptions} [options] - Options for the query.
   * @return {Promise<FundingObject | undefined>} A promise that resolves to the retrieved funding object, or undefined if not found.
   */
  async findById(id: number, options?: FindOneOptions): Promise<
    FundingObject & {
      rewards: FundingRewards[];
    } | undefined
  > {
    const user_id = options?.user_id ?? null;
    const ret = await this.db.selectFrom("fundings")
      .innerJoin("users as host", "fundings.host_id", "host.id")
      .$if(user_id !== null, (qb) =>
        qb.leftJoin(
          "user_funding_interest as interest",
          (join) =>
            join
              .onRef("interest.funding_id", "=", "fundings.id")
              .on("interest.user_id", "=", user_id),
        )
          .select([
            "interest.user_id as interest_user_id",
          ]))
      .$if(user_id !== null, (qb) =>
        qb.leftJoin(
          "funding_users",
          (join) =>
            join.onRef("funding_users.funding_id", "=", "fundings.id")
              .on("funding_users.user_id", "=", user_id),
        )
          .select([
            "funding_users.reward_id as participated_reward_id",
          ]))
      .selectAll(["fundings"])
      .select([
        "host.id as host_id",
        "host.nickname as host_nickname",
        "host.profile_image as host_profile_image",
        "host.email as host_email",
        "host.introduction as host_introduction",
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb.selectFrom("funding_tag_rel")
            .innerJoin(
              "funding_tags",
              "funding_tag_rel.tag_id",
              "funding_tags.id",
            )
            .whereRef("funding_tag_rel.funding_id", "=", "fundings.id")
            .select(["funding_tags.tag as tag", "funding_tags.id as id"]),
        ).as("tags"),
        jsonArrayFrom(
          eb.selectFrom("funding_rewards")
            .whereRef("funding_rewards.funding_id", "=", "fundings.id")
            // Unfortunately, the MySQL jsonArrayFrom and jsonObjectFrom
            // functions can only handle explicit selections due to limitations
            // of the json_object function. selectAll() is not allowed in
            // the subquery.
            .select([
              "funding_rewards.id",
              "funding_rewards.title",
              "funding_rewards.price",
              "funding_rewards.content",
              "funding_rewards.reward_count",
              "funding_rewards.reward_current_count",
              "funding_rewards.created_at",
              "funding_rewards.deleted_at",
            ]),
        ).as("rewards"),
      ])
      .where("fundings.id", "=", id)
      .executeTakeFirst();
    if (!ret) {
      return undefined;
    }
    return {
      ...ret,
      content_thumbnails: JSON.parse(ret.content_thumbnails) as string[],
    };
  }

  async findByTitle(title: string) {
    const ret = await this.db.selectFrom("fundings")
      .where("fundings.title", "=", title)
      .selectAll("fundings")
      .executeTakeFirst();
    return ret;
  }

  async getFundingRewards(funding_id: number): Promise<FundingRewards[]> {
    const ret = await this.db.selectFrom("funding_rewards")
      .where("funding_rewards.funding_id", "=", funding_id)
      .selectAll("funding_rewards")
      .execute();
    return ret;
  }

  async insert(
    funding: Omit<Insertable<DB["fundings"]>, "content_thumbnails"> & {
      content_thumbnails?: string[];
    },
  ): Promise<number | undefined> {
    const ret = await this.db.insertInto("fundings")
      .values({
        ...funding,
        content_thumbnails: funding.content_thumbnails
          ? JSON.stringify(funding.content_thumbnails)
          : undefined,
      })
      .executeTakeFirst();
    return Number(ret.insertId);
  }

  async insertTags(funding_id: number, tag_ids: number[]) {
    if (tag_ids.length === 0) {
      return;
    }
    return await this.db.insertInto("funding_tag_rel")
      .values(tag_ids.map((tag) => ({ tag_id: tag, funding_id })))
      .executeTakeFirstOrThrow();
  }
  async insertTagsByName(funding_id: number, tag_names: string[]) {
    if (tag_names.length === 0) {
      return;
    }
    await this.db.insertInto("funding_tag_rel")
      .columns(["tag_id", "funding_id"])
      .expression(
        (eb) =>
          eb.selectFrom("funding_tags")
            .where("funding_tags.tag", "in", tag_names)
            .select(["id", eb.val(funding_id).as("funding_id")]),
      ).execute();
  }
  async deleteTags(funding_id: number, tag_ids: number[]) {
    if (tag_ids.length === 0) {
      return;
    }
    return await this.db.deleteFrom("funding_tag_rel")
      .where("funding_tag_rel.funding_id", "=", funding_id)
      .where("funding_tag_rel.tag_id", "in", tag_ids)
      .executeTakeFirstOrThrow();
  }

  async insertRewards(
    rewards: Insertable<DB["funding_rewards"]>[],
  ) {
    if (rewards.length === 0) {
      return;
    }
    await this.db.insertInto("funding_rewards")
      .values(rewards)
      .executeTakeFirstOrThrow();
  }

  async updateReward(
    reward_id: number,
    rewards: Updateable<DB["funding_rewards"]>,
  ) {
    return await this.db.updateTable("funding_rewards")
      .set(rewards)
      .where("funding_rewards.id", "=", reward_id)
      .executeTakeFirstOrThrow();
  }

  async updateById(id: number, funding: Updateable<DB["fundings"]>) {
    return await this.db.updateTable("fundings")
      .set(funding)
      .where("fundings.id", "=", id)
      .executeTakeFirstOrThrow();
  }

  async setInterest(funding_id: number, user_id: number) {
    return await this.db.insertInto("user_funding_interest")
      .values({ funding_id, user_id })
      .executeTakeFirstOrThrow();
  }

  async unsetInterest(funding_id: number, user_id: number) {
    return await this.db.deleteFrom("user_funding_interest")
      .where("funding_id", "=", funding_id)
      .where("user_id", "=", user_id)
      .executeTakeFirstOrThrow();
  }

  async addCurrentValue(funding_id: number, operand: number) {
    return await this.db.updateTable("fundings")
      .set((eb) => ({
        current_value: eb("fundings.current_value", "+", operand),
      }))
      .where("fundings.id", "=", funding_id)
      .executeTakeFirstOrThrow();
  }

  async softDelete(funding_id: number) {
    return await this.db.updateTable("fundings")
      .set({
        deleted_at: new Date(),
      })
      .where("fundings.id", "=", funding_id)
      .executeTakeFirstOrThrow();
  }
}

export class FundingRewardsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findById(id: number): Promise<FundingRewards | undefined> {
    const ret = await this.db.selectFrom("funding_rewards")
      .where("funding_rewards.id", "=", id)
      .selectAll("funding_rewards")
      .executeTakeFirst();
    return ret;
  }
  async updateById(id: number, funding: Updateable<DB["funding_rewards"]>) {
    const ret = await this.db.updateTable("funding_rewards")
      .set(funding)
      .where("funding_rewards.id", "=", id)
      .executeTakeFirstOrThrow();
    return ret;
  }
}

export class FundingUsersRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAllByFundingId(funding_id: number, {
    limit = 50,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  } = {}): Promise<FundingUserObject[]> {
    const ret = await this.db.selectFrom("funding_users")
      .where("funding_users.funding_id", "=", funding_id)
      .selectAll("funding_users")
      .innerJoin("users", "users.id", "funding_users.user_id")
      .select([
        "users.email as user_email",
        "users.nickname as user_nickname",
        "users.profile_image as user_profile_image",
      ])
      .innerJoin(
        "funding_rewards",
        "funding_rewards.id",
        "funding_users.reward_id",
      )
      .select([
        "funding_rewards.title as reward_title",
        "funding_rewards.price as reward_price",
        "funding_rewards.content as reward_content",
      ])
      .limit(limit)
      .offset(offset)
      .orderBy("funding_users.created_at", "desc")
      .execute();
    return ret;
  }

  async insert(funding_user: Insertable<DB["funding_users"]>) {
    await this.db.insertInto("funding_users")
      .values(funding_user)
      .execute();
  }
  async deleteByUserIdAndFundingId(user_id: number, funding_id: number) {
    await this.db.deleteFrom("funding_users")
      .where("funding_users.user_id", "=", user_id)
      .where("funding_users.funding_id", "=", funding_id)
      .executeTakeFirstOrThrow();
  }
  async deleteByFundingId(funding_id: number) {
    await this.db.deleteFrom("funding_users")
      .where("funding_users.funding_id", "=", funding_id)
      .executeTakeFirstOrThrow();
  }
}

export class FundingTagRepo {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async insert(funding_tags: Insertable<DB["funding_tags"]>[]) {
    if (funding_tags.length === 0) {
      return;
    }
    await this.db.insertInto("funding_tags")
      .values(funding_tags)
      .execute();
  }

  async getAll() {
    return await this.db.selectFrom("funding_tags")
      .selectAll("funding_tags")
      .execute();
  }

  async intersectTags(tag_names: string[]) {
    if (tag_names.length === 0) {
      return [];
    }
    return await this.db.selectFrom("funding_tags")
      .where("funding_tags.tag", "in", tag_names)
      .selectAll("funding_tags")
      .execute();
  }
}

export class FundingReportsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }
  async findAll({
    limit = 50,
    offset = 0,
  }): Promise<FundingReportObject[]> {
    const result = await this.db.selectFrom("funding_reports")
      .innerJoin("users", "funding_reports.user_id", "users.id")
      .innerJoin("fundings", "funding_reports.funding_id", "fundings.id")
      .select([
        "funding_reports.id",
        "funding_reports.content",
        "funding_reports.meta",
        "funding_reports.created_at",
        "funding_reports.user_id",
        "funding_reports.funding_id",
      ])
      .select([
        "users.nickname as user_nickname",
        "users.profile_image as user_profile_image",
        "users.email as user_email",
        "fundings.title as funding_title",
        "fundings.thumbnail as funding_thumbnail",
        "fundings.begin_date as funding_begin_date",
        "fundings.end_date as funding_end_date",
      ])
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc")
      .execute();
    return result.map((x) => ({
      ...x,
      meta_parsed: JSON.parse(x.meta ?? "null"),
    }));
  }

  async insert(
    funding_report: Insertable<DB["funding_reports"]> & {
      meta_parsed?: string[];
    },
  ) {
    if (funding_report.meta_parsed) {
      funding_report.meta = JSON.stringify(funding_report.meta_parsed);
      delete funding_report.meta_parsed;
    }
    return await this.db.insertInto("funding_reports")
      .values(funding_report)
      .execute();
  }
}
