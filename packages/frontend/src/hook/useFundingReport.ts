import { API_URL } from "@/config";
import { FundingReportObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingReport({
  offset = 0,
  limit = 50,
} = {}) {
  const url = new URL("/api/v1/fundings/reports", API_URL);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  return useSWR<DateToString<FundingReportObject>[]>(
    url.href,
    fetcher,
  );
}

export { useFundingReport };
