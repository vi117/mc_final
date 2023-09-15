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

export interface FindOneOptions {
  user_id?: number;
}

export interface ArticleObject {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date | null;
  like_count: number;
  user_id: number;
  category: string;
  view_count: number;

  author_id: number;
  author_nickname: string;
  author_profile_image: string | null;
  author_email: string;

  like_user_id?: number | null;

  tags: {
    tag: string;
  }[];
}

export class ArticleRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async findAll(options: FindAllUsersOptions): Promise<ArticleObject[]> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const cursor = options?.cursor;
    const user_id = options?.user_id ?? null;
    const include_deleted = options?.include_deleted ?? false;
    const tags = options?.tags;

    const ret = await this.db.selectFrom("articles")
      .innerJoin("users as author", "articles.user_id", "author.id")
      .select([
        "author.id as author_id",
        "author.nickname as author_nickname",
        "author.profile_image as author_profile_image",
        "author.email as author_email",
      ])
      .$if(user_id !== null, (qb) =>
        qb.leftJoin(
          "article_likes as like",
          join =>
            join.onRef("articles.id", "=", "like.article_id")
              .on("like.user_id", "=", user_id),
        )
          .select([
            "like.user_id as like_user_id",
          ]))
      .$if(tags !== undefined, (qb) => {
        tags?.forEach((tag, index) => {
          qb = qb.innerJoin(
            `article_tag_rel as f${index}`,
            `f${index}.article_id`,
            "articles.id",
          )
            .innerJoin(
              `article_tags as t${index}`,
              `t${index}.id`,
              `f${index}.tag_id`,
            )
            .where(`t${index}.tag`, "=", tag) as unknown as typeof qb;
        });
        return qb;
      })
      .select(eb => [
        jsonArrayFrom(
          eb.selectFrom("article_tag_rel as r")
            .innerJoin(
              `article_tags as t`,
              `t.id`,
              `r.tag_id`,
            )
            .whereRef(`r.article_id`, "=", "article_id")
            .select([
              "t.tag as tag",
            ]),
        ).as("tags"),
      ])
      .selectAll("articles")
      .$if(
        cursor !== undefined,
        eb => eb.where("articles.id", "<", cursor ?? 0),
      )
      .$if(
        !include_deleted,
        (qb) => qb.where("articles.deleted_at", "is", null),
      )
      .limit(limit)
      .offset(offset)
      .execute();
    return ret;
  }

  async findById(
    id: number,
    options?: FindOneOptions,
  ): Promise<ArticleObject | undefined> {
    const user_id = options?.user_id ?? null;

    const ret = await this.db.selectFrom("articles")
      .innerJoin("users as author", "articles.user_id", "author.id")
      .select([
        "author.id as author_id",
        "author.nickname as author_nickname",
        "author.profile_image as author_profile_image",
        "author.email as author_email",
      ])
      .$if(user_id !== null, (qb) =>
        qb.leftJoin(
          "article_likes as like",
          join =>
            join.onRef("articles.id", "=", "like.article_id")
              .on("like.user_id", "=", user_id),
        ).select([
          "like.user_id as like_user_id",
        ]))
      .select(eb => [
        jsonArrayFrom(
          eb.selectFrom("article_tag_rel as r")
            .innerJoin(
              `article_tags as t`,
              `t.id`,
              `r.tag_id`,
            )
            .whereRef(`r.article_id`, "=", "article_id")
            .select([
              "t.tag as tag",
            ]),
        ).as("tags"),
      ])
      .where("articles.id", "=", id)
      .selectAll("articles")
      .executeTakeFirst();
    return ret;
  }

  async updateViewCount(id: number) {
    await this.db.updateTable("articles")
      .set(eb => ({
        view_count: eb("view_count", "+", 1),
      }))
      .where("articles.id", "=", id)
      .executeTakeFirstOrThrow();
  }
}
