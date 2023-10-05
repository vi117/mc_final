import { FundingReportObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingRequest({
  offset = 0,
  limit = 50,
} = {}) {
  const url = new URL("/api/v1/fundings/report", window.location.origin);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  return useSWR<DateToString<FundingReportObject>[]>(
    url.href,
    fetcher,
  );
}

export { useFundingRequest };
