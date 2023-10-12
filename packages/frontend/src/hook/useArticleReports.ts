import { ArticleReportObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useArticleReports({
  offset = 0,
  limit = 50,
} = {}) {
  const searchParams: [string, string][] = [];
  searchParams.push(["offset", offset.toString()]);
  searchParams.push(["limit", limit.toString()]);

  return useSWR<DateToString<ArticleReportObject>[]>(
    ["/api/v1/articles/reports", searchParams],
    fetcher,
  );
}

export { useArticleReports };
