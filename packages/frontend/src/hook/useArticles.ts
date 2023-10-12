import { ArticleObject } from "dto";
import useSWR from "swr";
import { ANIMAL_CATEGORY } from "../pages/community/constant";
import { DateToString, fetcher } from "./util";

interface UseArticleOptions {
  offset?: number;
  limit?: number;
  categories?: string[];
  tags?: string[];
  orderBy?: "id" | "like_count";
  include_deleted?: boolean;
  related_funding_id?: number;
}

export default function useArticles({
  offset = 0,
  limit = 50,
  categories = undefined,
  tags = undefined,
  orderBy = "id",
  /**
   * if true, include deleted articles. admin only.
   * @param {boolean}
   */
  include_deleted = false,
  related_funding_id = undefined,
}: UseArticleOptions = {}) {
  const searchParams: [string, string][] = [];
  searchParams.push(["offset", offset.toString()]);
  searchParams.push(["limit", limit.toString()]);

  if (categories && categories.length < ANIMAL_CATEGORY.length) {
    categories.forEach((category) => {
      searchParams.push(["categories[]", category]);
    });
  }
  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      searchParams.push(["tags[]", tag]);
    });
  }

  if (["id", "like_count"].includes(orderBy)) {
    searchParams.push(["orderBy", orderBy]);
  } else {
    console.error("orderBy value isn't acceptable. value: ", orderBy);
    searchParams.push(["orderBy", "id"]);
  }

  if (include_deleted) {
    searchParams.push(["include_deleted", "true"]);
  }
  if (related_funding_id !== undefined) {
    searchParams.push([
      "related_funding_id",
      related_funding_id.toString(),
    ]);
  }

  return useSWR<DateToString<ArticleObject>[]>(
    ["/api/v1/articles", searchParams],
    fetcher,
  );
}

export { useArticles };
