import { API_URL } from "@/config";

type DateToISOString<T> = T extends Date ? string : T;

export type DateToString<T> = {
  [P in keyof T]: DateToISOString<T[P]>;
};

export class FetchError extends Error {
  public info: unknown;
  constructor(message: string, body: unknown) {
    super(message);
    this.name = "FetchError";
    this.info = body;
  }
}

export const fetcher = async (
  [pathname, searchParams]: [string, string[][] | Record<string, string>],
) => {
  const url = new URL(pathname, API_URL);
  if (searchParams instanceof Array) {
    for (const [key, value] of searchParams) {
      url.searchParams.append(key, value);
    }
  } else if (searchParams instanceof Object) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.append(key, value);
    }
  }

  const res = await fetch(url.href, {
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new FetchError(data.message, data);
  }
  return res.json();
};
