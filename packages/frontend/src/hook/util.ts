type DateToISOString<T> = T extends Date ? string : T;

export type DateToString<T> = {
  [P in keyof T]: DateToISOString<T[P]>;
};
