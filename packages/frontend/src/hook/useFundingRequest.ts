import { FundingRequestObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingRequest({
  offset = 0,
  limit = 50,
  view_all = false,
} = {}) {
  const searchParams: [string, string][] = [];
  searchParams.push(["offset", offset.toString()]);
  searchParams.push(["limit", limit.toString()]);
  if (view_all) {
    searchParams.push(["view_all", "true"]);
  }

  return useSWR<DateToString<FundingRequestObject>[]>(
    ["/api/v1/fundings/request", searchParams],
    fetcher,
  );
}

export { useFundingRequest };
