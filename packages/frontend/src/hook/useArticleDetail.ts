import { ArticleSingleObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useArticleDetail(id: number, {
  with_comments = false,
} = {}) {
  return useSWR<DateToString<ArticleSingleObject>>(
    [`/api/v1/articles/${id}`, { with_comments: with_comments.toString() }],
    fetcher,
  );
}

export { useArticleDetail };
