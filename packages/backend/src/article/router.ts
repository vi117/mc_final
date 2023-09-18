import { getDB } from "@/db/util";
import { checkLogin } from "@/users/jwt";
import { parseQueryToNumber, parseQueryToStringList } from "@/util/query_param";
import { RouterCatch } from "@/util/util";
import assert from "assert";
import { Router } from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ArticleCommentRepository, ArticleRepository } from "./model";
import { likeArticle, unlikeArticle } from "./service";

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

  const result = await articleRepository.findAll({
    user_id: user?.id,
    include_deleted: shouldIncludeDeleted,
    offset,
    limit,
    tags: tags,
    cursor: cursor,
  });
  res.json(result).status(StatusCodes.OK);
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
  res.json(result).status(StatusCodes.OK);
}

async function getAllCommentsHandler(req: Request, res: Response) {
  const commentRepository = new ArticleCommentRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  const result = await commentRepository.findAllByArticleId(id);
  res.json(result).status(StatusCodes.OK);
}

async function postArticleHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const user_id = req.user?.id;
  assert(user_id !== undefined);

  const inserted_id = await articleRepository.insert({
    title: req.body.title,
    content: req.body.content,
    user_id,
    category: req.body.category,
  });

  res.json({ message: "success", id: inserted_id }).status(StatusCodes.OK);
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

async function updateArticleHandler(_req: Request, _res: Response) {
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
    res.status(StatusCodes.CONFLICT).json({ message: e.message });
    return;
  }
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function reportArticleHandler(_req: Request, _res: Response) {
}

async function postCommentHandler(req: Request, res: Response) {
  const commentRepository = new ArticleCommentRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user_id = req.user?.id;
  assert(user_id !== undefined);

  const inserted_id = await commentRepository.insert({
    article_id: id,
    content: req.body.content,
    user_id,
  });

  res.json({ message: "success", id: inserted_id }).status(StatusCodes.OK);
}
async function deleteCommentHandler(_req: Request, _res: Response) {
}

const router = Router();
router.get("/", RouterCatch(getAllArticleHandler));
router.get("/:id(\\d+)", RouterCatch(getSingleArticleHandler));
router.get("/:id(\\d+)/comments", RouterCatch(getAllCommentsHandler));

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
