import { FundingObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

interface UseFundingsOptions {
  offset?: number;
  limit?: number;
  tags?: string[];
  /**
   * 펀딩의 `host_id`가 같은 펀딩을 찾음.
   */
  host_id?: number;
  begin_date?: Date;
  /**
   * 펀딩의 `begin_date`가 주어진 `end_date` 보다 작은 펀딩을 찾음.
   *
   * admin only
   */
  end_date?: Date;
  /**
   * include deleted fundings
   * 비공개된 펀딩도 포함함.
   *
   * admin only
   */
  include_deleted?: boolean;

  /**
   * show user interested fundings
   */
  interest?: boolean;
  /**
   * show user participated fundings
   */
  participated?: boolean;

  /**
   * reviewed fundings
   */
  reviewed?: "reviewed" | "not_reviewed";
  /**
   * title
   */
  title?: string;
}

export default function useFundings({
  offset = 0,
  limit = 50,
  tags = undefined,
  host_id = undefined,
  begin_date = undefined,
  end_date = undefined,
  include_deleted = false,
  interest = false,
  participated = false,
  reviewed = undefined,
  title = undefined,
}: UseFundingsOptions = {}) {
  const searchParams: [string, string][] = [];
  searchParams.push(["offset", offset.toString()]);
  searchParams.push(["limit", limit.toString()]);
  if (host_id !== undefined) {
    searchParams.push(["host_id", host_id.toString()]);
  }
  if (begin_date !== undefined) {
    searchParams.push(["begin_date", begin_date.toISOString()]);
  }
  if (end_date !== undefined) {
    searchParams.push(["end_date", end_date.toISOString()]);
  }
  if (interest) {
    searchParams.push(["interest", "true"]);
  }
  if (include_deleted) {
    searchParams.push(["include_deleted", "true"]);
  }
  if (participated) {
    searchParams.push(["participated", "true"]);
  }
  if (reviewed !== undefined) {
    searchParams.push(["reviewed", reviewed]);
  }
  if (title !== undefined) {
    searchParams.push(["title", title]);
  }

  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      searchParams.push(["tags[]", tag]);
    });
  }

  return useSWR<DateToString<FundingObject>[]>(
    ["/api/v1/fundings", searchParams],
    fetcher,
  );
}

export { useFundings };
