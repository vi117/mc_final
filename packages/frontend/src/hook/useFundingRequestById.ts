import { FundingRequestObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingRequestById(id: number) {
  return useSWR<DateToString<FundingRequestObject>>(
    [`/api/v1/fundings/request/${id}`, []],
    fetcher,
  );
}

export { useFundingRequestById };
