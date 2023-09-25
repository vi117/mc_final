import { ArticleObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useArticleDetail(id: number, {
  with_comments = false,
} = {}) {
  const url = new URL(`/api/v1/articles/${id}`, window.location.origin);

  if (with_comments) {
    url.searchParams.append("with_comments", "true");
  }

  return useSWR<DateToString<ArticleObject>>(
    url.href,
    fetcher,
  );
}
