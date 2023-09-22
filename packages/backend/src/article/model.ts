import { DB, log_query } from "@/db/util";
import debug_fn from "debug";
import { ArticleObject, CommentObject } from "dto";
import { Insertable, Kysely } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/mysql";

export { ArticleObject, CommentObject };

const debug = debug_fn("joinify:db");

export interface FindAllUsersOptions {
  limit?: number;
  offset?: number;
  cursor?: number;
  /**
   * 정렬.
   * id, like_count
   */
  orderBy?: "id" | "like_count";
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
  /**
   * category
   */
  allow_categories?: string[];
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
      ]);
  }

  async findAll(options?: FindAllUsersOptions): Promise<ArticleObject[]> {
    const {
      limit = 50,
      offset = 0,
      cursor,
      user_id,
      include_deleted = false,
      tags,
      allow_categories,
      orderBy,
    } = options ?? {};

    const ret = await this.getFindBaseQuery({
      user_id,
      tags,
    })
      .selectAll("articles")
      .$if(
        cursor !== undefined,
        (eb) => eb.where("articles.id", "<", cursor ?? 0),
      )
      .$if(
        !include_deleted,
        (qb) => qb.where("articles.deleted_at", "is", null),
      )
      .$if(
        allow_categories !== undefined,
        // allow_categories is an array of strings
        // that are categories of articles
        (qb) => qb.where("articles.category", "in", allow_categories ?? []),
      )
      .limit(limit)
      .offset(offset)
      .$if(
        orderBy !== undefined,
        (qb) => qb.orderBy(`articles.${orderBy ?? "id"}`, "desc"),
      )
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

  async update(id: number, article: {
    title?: string;
    content?: string;
    category?: string;
  }) {
    const { title, content, category } = article;
    await this.db.updateTable("articles")
      .set({
        title,
        content,
        category,
      })
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  }

  async addTag(article_id: number, tag_id: number) {
    return await this.addTagsFromIds(article_id, [tag_id]);
  }

  async addTagsFromIds(article_id: number, tag_ids: number[]) {
    await this.db.insertInto("article_tag_rel")
      .values(tag_ids.map((id) => ({
        article_id,
        tag_id: id,
      })))
      .executeTakeFirst();
  }
  async addTagsFromName(article_id: number, tags: string[]) {
    await this.db.insertInto("article_tag_rel")
      .expression((eb) =>
        eb.selectFrom("article_tags")
          .where("article_tags.tag", "in", tags)
          .select(["id as tag_id", eb.val(article_id).as("article_id")])
      );
  }

  async removeTag(article_id: number, tag_id: number) {
    await this.db.deleteFrom("article_tag_rel")
      .where("article_id", "=", article_id)
      .where("tag_id", "=", tag_id)
      .executeTakeFirstOrThrow();
  }

  async removeTags(article_id: number, tag_ids: number[]) {
    await this.db.deleteFrom("article_tag_rel")
      .where("article_id", "=", article_id)
      .where("tag_id", "in", tag_ids)
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

  async deleteById(id: number) {
    const r = await this.db.deleteFrom("comments")
      .where("id", "=", id)
      .executeTakeFirst();
    return r.numDeletedRows === 1n;
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

export class ArticleTagsRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }
  async findAll(): Promise<{
    id: number;
    tag: string;
  }[]> {
    const ret = await this.db.selectFrom("article_tags")
      .selectAll("article_tags")
      .execute();
    return ret;
  }

  async findByName(name: string) {
    const ret = await this.db.selectFrom("article_tags")
      .where("tag", "=", name)
      .selectAll("article_tags")
      .executeTakeFirst();
    return ret;
  }

  async findByNames(names: string[]) {
    const ret = await this.db.selectFrom("article_tags")
      .where("tag", "in", names)
      .selectAll("article_tags")
      .execute();
    return ret;
  }

  async insert(tag: Insertable<DB["article_tags"]>) {
    const res = await this.db.insertInto("article_tags")
      .values(tag)
      .executeTakeFirst();
    return Number(res.insertId);
  }

  async deleteByName(name: string) {
    const res = await this.db.deleteFrom("article_tags")
      .where("tag", "=", name)
      .executeTakeFirstOrThrow();
    return res.numDeletedRows === 1n;
  }

  async deleteById(id: number) {
    const res = await this.db.deleteFrom("article_tags")
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
    return res.numDeletedRows === 1n;
  }
}

export class ArticleReportRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  async insert(report: Insertable<DB["article_reports"]>) {
    const res = await this.db.insertInto("article_reports")
      .values(report)
      .executeTakeFirst();
    return Number(res.insertId);
  }

  async deleteById(id: number) {
    const res = await this.db.deleteFrom("article_reports")
      .where("id", "=", id)
      .executeTakeFirst();
    return res.numDeletedRows === 1n;
  }

  async deleteAllByArticleId(article_id: number) {
    const res = await this.db.deleteFrom("article_reports")
      .where("article_id", "=", article_id)
      .executeTakeFirst();
    return res.numDeletedRows === 1n;
  }
}
