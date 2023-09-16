import { ParsedQs } from "qs";

export function parseQueryToString(
  q: ParsedQs[keyof ParsedQs],
): string | undefined;
export function parseQueryToString(
  q: ParsedQs[keyof ParsedQs],
  default_value: string,
): string;
export function parseQueryToString(
  q: ParsedQs[keyof ParsedQs],
  default_value?: string,
): string | undefined {
  return typeof q === "string" ? q : default_value;
}
export function parseQueryToNumber(
  q: ParsedQs[keyof ParsedQs],
): number | undefined;
export function parseQueryToNumber(
  q: ParsedQs[keyof ParsedQs],
  default_value: number,
): number;
export function parseQueryToNumber(
  q: ParsedQs[keyof ParsedQs],
  default_value?: number,
): number | undefined {
  if (typeof q !== "string") return default_value;
  const value = parseInt(q);
  return isNaN(value) ? default_value : value;
}
