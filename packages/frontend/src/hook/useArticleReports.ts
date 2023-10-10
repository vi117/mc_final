import { API_URL } from "@/config";
import { ArticleReportObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useArticleReports({
  offset = 0,
  limit = 50,
} = {}) {
  const url = new URL("/api/v1/articles/reports", API_URL);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  return useSWR<DateToString<ArticleReportObject>[]>(
    url.href,
    fetcher,
  );
}

export { useArticleReports };
