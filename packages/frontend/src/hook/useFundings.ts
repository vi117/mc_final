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
   * 삭제된 펀딩도 포함함.
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
  const url = new URL("/api/v1/fundings", window.location.href);
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("limit", limit.toString());
  if (host_id !== undefined) {
    url.searchParams.append("host_id", host_id.toString());
  }
  if (begin_date !== undefined) {
    url.searchParams.append("begin_date", begin_date.toISOString());
  }
  if (end_date !== undefined) {
    url.searchParams.append("end_date", end_date.toISOString());
  }
  if (interest) {
    url.searchParams.append("interest", "true");
  }
  if (include_deleted) {
    url.searchParams.append("include_deleted", "true");
  }
  if (participated) {
    url.searchParams.append("participated", "true");
  }
  if (reviewed !== undefined) {
    url.searchParams.append("reviewed", reviewed);
  }
  if (title !== undefined) {
    url.searchParams.append("title", title);
  }

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

export { useFundings };
