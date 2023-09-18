import { DB, log_query } from "@/db/util";
import debug_fn from "debug";
import { Insertable, Kysely } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/mysql";

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
  /**
   * with comments
   */
  with_comments?: boolean;
  /**
   * comment_limit
   */
  comment_limit?: number;
}

interface FindBaseOptions {
  /**
   * 사용자 ID
   */
  user_id?: number;
  /**
   * tags to search
   */
  tags?: string[];
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

export interface CommentObject {
  id: number;
  content: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date | null;
  user_id: number;
  nickname: string;
  profile_image: string | null;
  email: string;
}

export class ArticleRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }
  private getFindBaseQuery(options: FindBaseOptions) {
    const {
      user_id = null,
      tags,
    } = options;

    return this.db.selectFrom("articles")
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
          (join) =>
            join.onRef("articles.id", "=", "like.article_id")
              .on("like.user_id", "=", user_id),
        ).select([
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
      .select((eb) => [
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
      .selectAll("articles");
  }

  async findAll(options?: FindAllUsersOptions): Promise<ArticleObject[]> {
    const {
      limit = 50,
      offset = 0,
      cursor,
      user_id,
      include_deleted = false,
      tags,
    } = options ?? {};

    const ret = await this.getFindBaseQuery({
      user_id,
      tags,
    })
      .$if(
        cursor !== undefined,
        (eb) => eb.where("articles.id", "<", cursor ?? 0),
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
  ): Promise<
    ArticleObject & {
      comments?: CommentObject[];
    } | undefined
  > {
    const {
      user_id,
      with_comments = false,
      comment_limit = 50,
    } = options ?? {};

    const ret = await this.getFindBaseQuery({
      user_id,
    }).$if(with_comments, (qb) =>
      qb.select((eb) => [
        jsonArrayFrom(
          eb.selectFrom("comments as c")
            .innerJoin("users as u", "c.user_id", "u.id")
            .where("c.article_id", "=", id)
            // Unfortunately, the MySQL jsonArrayFrom and jsonObjectFrom
            // functions can only handle explicit selections due to limitations
            // of the json_object function. selectAll() is not allowed in
            // the subquery.
            .select([
              "c.id as id",
              "c.content as content",
              "c.created_at as created_at",
              "c.user_id as user_id",
              "c.deleted_at as deleted_at",
              "c.updated_at as updated_at",
            ])
            .select([
              "u.nickname as nickname",
              "u.profile_image as profile_image",
              "u.email as email",
            ])
            .limit(comment_limit),
        ).as("comments"),
      ]))
      .selectAll("articles")
      .where("articles.id", "=", id)
      .$call(log_query(debug))
      .executeTakeFirst();
    return ret;
  }

  async updateViewCount(id: number) {
    await this.db.updateTable("articles")
      .set((eb) => ({
        view_count: eb("view_count", "+", 1),
      }))
      .where("articles.id", "=", id)
      .executeTakeFirstOrThrow();
  }

  async insert(article: Insertable<DB["articles"]>) {
    const res = await this.db.insertInto("articles")
      .values(article)
      .executeTakeFirst();
    return Number(res.insertId);
  }

  async softDelete(id: number) {
    await this.db.updateTable("articles")
      .where("id", "=", id)
      .set({
        deleted_at: new Date(),
      })
      .executeTakeFirstOrThrow();
  }

  async addLike(article_id: number, count: number) {
    await this.db.updateTable("articles")
      .set((eb) => ({
        like_count: eb("like_count", "+", count),
      }))
      .where("id", "=", article_id)
      .executeTakeFirstOrThrow();
  }

  async addViewCount(article_id: number, count: number) {
    await this.db.updateTable("articles")
      .set((eb) => ({
        view_count: eb("view_count", "+", count),
      }))
      .where("id", "=", article_id)
      .executeTakeFirstOrThrow();
  }
}

export class ArticleCommentRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }
  async findAllByArticleId(article_id: number): Promise<CommentObject[]> {
    const ret = await this.db.selectFrom("comments")
      .innerJoin("users as author", "comments.user_id", "author.id")
      .select([
        "author.id as user_id",
        "author.nickname as nickname",
        "author.profile_image as profile_image",
        "author.email as email",
      ])
      .where("comments.article_id", "=", article_id)
      .selectAll("comments")
      .execute();
    return ret;
  }

  async insert(comment: Insertable<DB["comments"]>) {
    const res = await this.db.insertInto("comments")
      .values(comment)
      .executeTakeFirst();
    return Number(res.insertId);
  }
}

export class ArticleLikeRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }
  async insert(like: Insertable<DB["article_likes"]>) {
    const res = await this.db.insertInto("article_likes")
      .values(like)
      .executeTakeFirst();
    return Number(res.insertId);
  }
  async deleteByUserIdAndArticleId(user_id: number, article_id: number) {
    const res = await this.db.deleteFrom("article_likes")
      .where("user_id", "=", user_id)
      .where("article_id", "=", article_id)
      .executeTakeFirstOrThrow();
    return res.numDeletedRows === 1n;
  }
}
