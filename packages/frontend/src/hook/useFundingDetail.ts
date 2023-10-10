import { API_URL } from "@/config";
import { FundingObject, FundingRewards } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingDetail(id: number) {
  const url = new URL(`/api/v1/fundings/${id}`, API_URL);
  return useSWR<
    DateToString<FundingObject> & {
      rewards: DateToString<FundingRewards>[];
    }
  >(
    url.href,
    fetcher,
  );
}

export { useFundingDetail };
