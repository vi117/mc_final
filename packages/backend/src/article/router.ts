import { getDB } from "@/db/util";
import { checkLogin } from "@/users/jwt";
import ajv from "@/util/ajv";
import { assert_param } from "@/util/assert_param";
import {
  parseQueryToNumber,
  parseQueryToString,
  parseQueryToStringList,
} from "@/util/query_param";
import { RouterCatch } from "@/util/util";
import { JSONSchemaType } from "ajv";
import assert from "assert";
import { Router } from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sanitize from "sanitize-html";
import {
  ArticleCommentRepository,
  ArticleReportRepository,
  ArticleRepository,
} from "./model";
import { ArticleLikeError, likeArticle, unlikeArticle } from "./service";

/**
 * Retrieves all articles based on the provided query parameters.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - Returns a promise that resolves to void.
 */
async function getAllArticleHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const user = req.user;
  const shouldIncludeDeleted = user?.is_admin
    && req.query.include_deleted === "true";
  const offset = parseQueryToNumber(req.query.offset, 0);
  const limit = parseQueryToNumber(req.query.limit, 50);
  const cursor = parseQueryToNumber(req.query.cursor);
  const tags = parseQueryToStringList(req.query.tags);
  const categories = parseQueryToStringList(req.query.categories);
  const orderBy = parseQueryToString(req.query.orderBy) ?? "id";
  const related_funding_id = parseQueryToNumber(req.query.related_funding_id);

  if (orderBy !== "id" && orderBy !== "like_count") {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "orderBy must be id or like_count",
    });
    return;
  }

  const result = await articleRepository.findAll({
    user_id: user?.id,
    include_deleted: shouldIncludeDeleted,
    offset,
    limit,
    tags: tags,
    cursor: cursor,
    allow_categories: categories,
    orderBy: orderBy,
    related_funding_id: related_funding_id,
  });
  res.status(StatusCodes.OK).json(result);
}

/**
 * Retrieves a single funding handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The response promise.
 */
async function getSingleArticleHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const with_comments = req.query.with_comments === "true";
  const user = req.user;
  const result = await articleRepository.findById(id, {
    user_id: user?.id,
    with_comments: with_comments,
  });
  // update view count
  articleRepository.updateViewCount(id);
  if (!result || (!user?.is_admin && result.deleted_at !== null)) {
    res.status(StatusCodes.NOT_FOUND).json();
    return;
  }
  res.status(StatusCodes.OK).json(result);
}

async function getAllCommentsHandler(req: Request, res: Response) {
  const commentRepository = new ArticleCommentRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  const result = await commentRepository.findAllByArticleId(id);
  res.status(StatusCodes.OK).json(result);
}

async function getAllLikesHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const id = req.user?.id;
  assert(id !== undefined);
  const offset = parseQueryToNumber(req.query.offset, 0);
  const limit = parseQueryToNumber(req.query.limit, 50);
  const tags = parseQueryToStringList(req.query.tags);
  const orderBy = parseQueryToString(req.query.orderBy) ?? "created_at";
  assert_param(
    orderBy === "created_at",
    "orderBy must be created_at",
  );

  const result = await articleRepository.findAllLikes(id, {
    offset,
    limit,
    tags: tags,
    orderBy: orderBy,
  });
  res.status(StatusCodes.OK).json(result);
}

async function getAllReportsHandler(req: Request, res: Response) {
  const articleRepository = new ArticleReportRepository(getDB());

  const offset = parseQueryToNumber(req.query.offset, 0);
  const limit = parseQueryToNumber(req.query.limit, 50);

  const result = await articleRepository.findAll({
    offset,
    limit,
  });

  res.status(StatusCodes.OK).json(result);
}

async function postArticleHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const user_id = req.user?.id;
  assert(user_id !== undefined);
  const body = req.body;
  const v = ajv.validate({
    type: "object",
    properties: {
      title: { type: "string" },
      content: { type: "string" },
      category: { type: "string" },
      related_funding_id: { type: "number" },
      tags: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["title", "content", "category"],
  } as JSONSchemaType<{
    title: string;
    content: string;
    category: string;
    tags: string[];
  }>, body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
  }

  const content = sanitize(body.content, {
    allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
  });

  const inserted_id = await articleRepository.insert({
    title: body.title,
    content: content,
    user_id,
    category: body.category,
    related_funding_id: body.related_funding_id,
  });
  // TODO(vi117): add tags

  res.status(StatusCodes.CREATED)
    .json({ message: "success", id: inserted_id });
}
async function deleteArticleHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user = req.user;
  assert(user);

  const article = await articleRepository.findById(id);
  if (!article) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "게시글이 존재하지 않습니다.",
    });
    return;
  }
  if (!user.is_admin && article.user_id !== user.id) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "게시글 소유자가 아닙니다.",
    });
    return;
  }
  await articleRepository.softDelete(id);
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function updateArticleHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user = req.user;
  assert(user);
  const v = ajv.validate({
    type: "object",
    properties: {
      title: { type: "string" },
      content: { type: "string" },
      category: { type: "string" },
      tags: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }
  // TODO(vi117): support tag
  await articleRepository.update(id, {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
  });
  res.json({ message: "success" }).status(StatusCodes.OK);
}
async function likeArticleHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user_id = req.user?.id;
  assert(user_id !== undefined);
  const unlike = req.query.unlike === "true";
  try {
    if (unlike) {
      await unlikeArticle(user_id, id);
    } else {
      await likeArticle(user_id, id);
    }
  } catch (e) {
    if (e instanceof ArticleLikeError) {
      res.status(StatusCodes.CONFLICT).json({ message: e.message });
      return;
    }
    throw e;
  }
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function reportArticleHandler(req: Request, res: Response) {
  const articleReportRepository = new ArticleReportRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user_id = req.user?.id;
  assert(user_id !== undefined);
  const v = ajv.validate({
    type: "object",
    properties: {
      reason: { type: "string" },
    },
    required: ["reason"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }
  const { reason } = req.body;
  articleReportRepository.insert({
    article_id: id,
    user_id,
    content: reason,
  });
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function postCommentHandler(req: Request, res: Response) {
  const commentRepository = new ArticleCommentRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user_id = req.user?.id;
  assert(user_id !== undefined);

  const v = ajv.validate({
    type: "object",
    properties: {
      content: { type: "string" },
    },
    required: ["content"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "댓글을 입력해주세요.",
      errors: ajv.errors,
    });
    return;
  }

  const inserted_id = await commentRepository.insert({
    article_id: id,
    content: req.body.content,
    user_id,
  });

  res.status(StatusCodes.CREATED)
    .json({ message: "success", id: inserted_id });
}
async function deleteCommentHandler(req: Request, res: Response) {
  const commentRepository = new ArticleCommentRepository(getDB());
  const id = parseInt(req.params.commentId);
  assert(!isNaN(id));
  const user = req.user;
  assert(user);
  const exists = await commentRepository.deleteById(id);
  if (!exists) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "댓글이 존재하지 않습니다.",
    });
    return;
  }
  res.json({ message: "success" }).status(StatusCodes.OK);
}

const router = Router();
router.get("/", RouterCatch(getAllArticleHandler));
router.get("/:id(\\d+)", RouterCatch(getSingleArticleHandler));
router.get("/:id(\\d+)/comments", RouterCatch(getAllCommentsHandler));
router.get("/likes", RouterCatch(getAllLikesHandler));
router.get("/reports", RouterCatch(getAllReportsHandler));

router.post("/", checkLogin(), RouterCatch(postArticleHandler));
router.delete("/:id(\\d+)", checkLogin(), RouterCatch(deleteArticleHandler));
router.patch("/:id(\\d+)", checkLogin(), RouterCatch(updateArticleHandler));
router.post("/:id(\\d+)/like", checkLogin(), RouterCatch(likeArticleHandler));
router.post(
  "/:id(\\d+)/report",
  checkLogin(),
  RouterCatch(reportArticleHandler),
);
router.post(
  "/:id(\\d+)/comments",
  checkLogin(),
  RouterCatch(postCommentHandler),
);
router.delete(
  "/:id(\\d+)/comments/:commentId(\\d+)",
  RouterCatch(deleteCommentHandler),
);

export default router;
