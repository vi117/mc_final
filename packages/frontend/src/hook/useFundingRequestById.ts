import { FundingRequestObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingRequestById(id: number) {
  const url = new URL(`/api/v1/fundings/request/${id}`, window.location.origin);

  return useSWR<DateToString<FundingRequestObject>[]>(
    url.href,
    fetcher,
  );
}

export { useFundingRequestById };
