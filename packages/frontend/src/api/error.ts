export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: {
      message: string;
      code?: string;
    },
  ) {
    super(message);
    this.name = "APIError";
  }
}
