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
  const url = new URL("/api/v1/articles", window.location.href);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  if (categories && categories.length < ANIMAL_CATEGORY.length) {
    categories.forEach((category) => {
      url.searchParams.append("categories[]", category);
    });
  }
  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      url.searchParams.append("tags[]", tag);
    });
  }

  if (["id", "like_count"].includes(orderBy)) {
    url.searchParams.append("orderBy", orderBy);
  } else {
    console.error("orderBy value isn't acceptable. value: ", orderBy);
    url.searchParams.append("orderBy", "id");
  }

  if (include_deleted) {
    url.searchParams.append("include_deleted", "true");
  }
  if (related_funding_id !== undefined) {
    url.searchParams.append(
      "related_funding_id",
      related_funding_id.toString(),
    );
  }

  return useSWR<DateToString<ArticleObject>[]>(
    url.href,
    fetcher,
  );
}
