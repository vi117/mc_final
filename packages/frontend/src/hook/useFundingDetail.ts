import { FundingObject, FundingRewards } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useFundingDetail(id: number) {
  return useSWR<
    DateToString<FundingObject> & {
      rewards: DateToString<FundingRewards>[];
    }
  >(
    [`/api/v1/fundings/${id}`, []],
    fetcher,
  );
}

export { useFundingDetail };
