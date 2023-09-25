type DateToISOString<T> = T extends Date ? string : T;

export type DateToString<T> = {
  [P in keyof T]: DateToISOString<T[P]>;
};

class FetchError extends Error {
  constructor(message: string, public body: unknown) {
    super(message);
    this.name = "FetchError";
  }
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json();
    throw new FetchError(res.statusText, data);
  }
  return res.json();
};
