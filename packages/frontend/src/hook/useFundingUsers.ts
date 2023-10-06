import { FundingUserObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 *
 * @param {number} funding_id - The ID of the funding.
 * @param {Object} options - The options for the function.
 * @param {number} options.offset - The offset for pagination. Default is 0.
 * @param {number} options.limit - The limit for pagination. Default is 50.
 * @return {Array<DateToString<FundingUserObject>>} - The result of the function.
 */
export default function useFundingUsers(funding_id: number, {
  offset = 0,
  limit = 50,
} = {}) {
  const url = new URL(
    `/api/v1/fundings/${funding_id}/users`,
    window.location.origin,
  );
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());

  return useSWR<DateToString<FundingUserObject>[]>(
    url.href,
    fetcher,
  );
}

export { useFundingUsers };
