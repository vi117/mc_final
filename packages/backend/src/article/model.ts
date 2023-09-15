import { DB } from "@/db/util";
import { Kysely } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/mysql";

export interface FindAllUsersOptions {
  limit?: number;
  offset?: number;
  cursor?: number;
  /**
   * 사용자 ID
   */
  user_id?: number;
  /**
   * include_deleted
   * @default false
   */
  include_deleted?: boolean;
  /**
   * tags to search
   */
  tags?: string[];
}

export class ArticleRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAll(options: FindAllUsersOptions) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const cursor = options?.cursor;
    const user_id = options?.user_id ?? null;
    // const include_deleted = options?.include_deleted ?? false;
    // const tags = options?.tags;

    const ret = await this.db.selectFrom("articles")
      .innerJoin("users as author", "articles.user_id", "author.id")
      .select([
        "author.id as author_id",
        "author.nickname as author_nickname",
        "author.profile_image as author_profile_image",
        "author.email as author_email",
      ])
      .leftJoin(
        "article_likes as like",
        join =>
          join.onRef("articles.id", "=", "like.article_id")
            .on("like.user_id", "=", user_id),
      )
      .select([
        "like.user_id as like_user_id",
      ])
      .select(eb => [
        jsonArrayFrom(
          eb.selectFrom("article_tag_rel as r")
            .innerJoin(
              `article_tags as t`,
              `t.id`,
              `r.tag_id`,
            )
            .whereRef(`r.article_id`, "=", "article_id"),
        ).as("tags"),
      ])
      .selectAll("articles")
      .$if(
        cursor !== undefined,
        eb => eb.where("articles.id", "<", cursor ?? 0),
      )
      .limit(limit)
      .offset(offset)
      .execute();
    return ret;
  }
}
