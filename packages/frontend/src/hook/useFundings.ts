import { FundingObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

interface UseFundingsOptions {
  offset?: number;
  limit?: number;
  tags?: string[];
}

export default function useFundings({
  offset = 0,
  limit = 50,
  tags = undefined,
}: UseFundingsOptions = {}) {
  const url = new URL("/api/v1/fundings", window.location.href);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      url.searchParams.append("tags[]", tag);
    });
  }

  return useSWR<DateToString<FundingObject>[]>(
    url.href,
    fetcher,
  );
}
