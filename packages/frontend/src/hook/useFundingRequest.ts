import { FundingRequestObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingRequest({
  offset = 0,
  limit = 50,
  view_all = false,
} = {}) {
  const url = new URL("/api/v1/fundings/request", window.location.origin);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());
  if (view_all) {
    url.searchParams.append("view_all", "true");
  }

  return useSWR<DateToString<FundingRequestObject>[]>(
    url.href,
    fetcher,
  );
}

export { useFundingRequest };
