import { API_URL } from "@/config";
import { ArticleObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

interface UseArticleOptions {
  offset?: number;
  limit?: number;
  tags?: string[];
}

export default function useLikedArticles({
  offset = 0,
  limit = 50,
  tags = undefined,
}: UseArticleOptions = {}) {
  const url = new URL("/api/v1/articles/likes", API_URL);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      url.searchParams.append("tags[]", tag);
    });
  }

  return useSWR<DateToString<ArticleObject>[]>(
    url.href,
    fetcher,
  );
}

export { useLikedArticles };
