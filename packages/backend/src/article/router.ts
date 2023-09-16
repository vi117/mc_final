import { getDB } from "@/db/util";
import { parseQueryToNumber, parseQueryToStringList } from "@/util/query_param";
import { RouterCatch } from "@/util/util";
import assert from "assert";
import { Router } from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ArticleRepository } from "./model";

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
async function getSingleFundingHandler(req: Request, res: Response) {
  const articleRepository = new ArticleRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const with_comments = req.query.with_comments === "true";
  const user = req.user;
  const result = await articleRepository.findById(id, {
    user_id: user?.id,
    with_comments: with_comments,
  });
  if (!result || (!user?.is_admin && result.deleted_at !== null)) {
    res.status(StatusCodes.NOT_FOUND).json();
    return;
  }
  res.json(result).status(StatusCodes.OK);
}

const router = Router();
router.get("/", RouterCatch(getAllArticleHandler));
router.get("/:id", RouterCatch(getSingleFundingHandler));

export default router;
