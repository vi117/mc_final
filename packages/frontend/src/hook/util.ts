type DateToISOString<T extends Date> = T extends Date ? string : never;

export type DateToString<T> = {
  [P in keyof T]: T[P] extends Date ? DateToISOString<T[P]> : T[P];
};
