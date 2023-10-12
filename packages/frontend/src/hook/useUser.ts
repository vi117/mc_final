import { UserObject } from "dto";
import useSWR from "swr";
import { DateToString, fetcher } from "./util";

export default function useUserInfo(id: number) {
  return useSWR<
    DateToString<Omit<UserObject, "password" | "address" | "phone">>
  >(
    [`/api/v1/users/${id}`, []],
    fetcher,
  );
}

export { useUserInfo };
