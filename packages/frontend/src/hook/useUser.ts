import { UserObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useUserInfo(id: number) {
  const url = new URL(`/api/v1/users/${id}`, window.location.href);

  return useSWR<
    DateToString<Omit<UserObject, "password" | "address" | "phone">>
  >(
    url.href,
    fetcher,
  );
}

export { useUserInfo };
