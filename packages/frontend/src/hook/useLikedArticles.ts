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
  const searchParams: [string, string][] = [];
  searchParams.push(["offset", offset.toString()]);
  searchParams.push(["limit", limit.toString()]);

  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      searchParams.push(["tags[]", tag]);
    });
  }

  return useSWR<DateToString<ArticleObject>[]>(
    ["/api/v1/articles/likes", searchParams],
    fetcher,
  );
}

export { useLikedArticles };
