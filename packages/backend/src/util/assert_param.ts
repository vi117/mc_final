export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export function assert_param(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new BadRequestError(message);
  }
}
