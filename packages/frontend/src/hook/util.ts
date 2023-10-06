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

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json();
    throw new FetchError(res.statusText, data);
  }
  return res.json();
};
