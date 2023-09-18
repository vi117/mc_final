import {
  isDuplKeyError as isDuplicatedKeyError,
  safeTransaction,
} from "@/db/util";
import { ArticleLikeRepository, ArticleRepository } from "./model";

export class ArticleLikeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArticleLikeError";
  }
}

export function likeArticle(user_id: number, article_id: number) {
  return safeTransaction(async (db) => {
    const likeRepository = new ArticleLikeRepository(db);
    try {
      await likeRepository.insert({
        user_id,
        article_id,
      });
    } catch (error) {
      if (isDuplicatedKeyError(error)) {
        throw new ArticleLikeError("already liked");
      }
      throw error;
    }
    const articleRepository = new ArticleRepository(db);
    await articleRepository.addLike(article_id, 1);
  });
}

export function unlikeArticle(user_id: number, article_id: number) {
  return safeTransaction(async (db) => {
    const likeRepository = new ArticleLikeRepository(db);
    const isDeleted = await likeRepository.deleteByUserIdAndArticleId(
      user_id,
      article_id,
    );
    if (isDeleted) {
      throw new ArticleLikeError("not liked");
    }
    const articleRepository = new ArticleRepository(db);
    await articleRepository.addLike(article_id, -1);
  });
}
