import { FundingRequestObject } from "dto";
import useSWR from "swr";
import { DateToString } from "./util";

export default function useFundingRequest() {
  return useSWR<DateToString<FundingRequestObject>[]>(
    "/api/v1/fundings/request",
    (url) => fetch(url).then((res) => res.json()),
  );
}
