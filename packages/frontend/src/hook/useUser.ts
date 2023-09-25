import { UserObject } from "dto";
import useSWR from "swr";
import { DateToString } from "./util";

export default function useUserInfo(id: number) {
  const url = new URL(`/api/v1/users/${id}`, window.location.href);

  return useSWR<
    DateToString<Omit<UserObject, "password" | "address" | "phone">>
  >(
    url.href,
    (url) => fetch(url).then((res) => res.json()),
  );
}
