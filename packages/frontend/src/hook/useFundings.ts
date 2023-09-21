import { FundingObject } from "dto";
import useSWR from "swr";
import { DateToString } from "./util";

export function useFundings({
  offset = 0,
  limit = 50,
}) {
  const url = new URL("/api/v1/fundings", window.location.href);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  return useSWR<DateToString<FundingObject>[]>(
    url.href,
    (url) => fetch(url).then((res) => res.json()),
  );
}
