import { FundingReportObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingReport({
  offset = 0,
  limit = 50,
} = {}) {
  const searchParams: [string, string][] = [];
  searchParams.push(["offset", offset.toString()]);
  searchParams.push(["limit", limit.toString()]);

  return useSWR<DateToString<FundingReportObject>[]>(
    ["/api/v1/fundings/reports", searchParams],
    fetcher,
  );
}

export { useFundingReport };
