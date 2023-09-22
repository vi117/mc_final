import { StatusCodes } from "http-status-codes";

export class HandlerErrorBase extends Error {
  constructor(
    message: string,
    public name: string,
    public status: number,
    public options?: object,
  ) {
    super(message);
  }
}

export class BadRequestError extends HandlerErrorBase {
  constructor(message: string, public options?: object) {
    super(message, "BadRequestError", StatusCodes.BAD_REQUEST, options);
  }
}

export class NotFoundError extends HandlerErrorBase {
  constructor(message: string, public options?: object) {
    super(message, "NotFoundError", StatusCodes.NOT_FOUND, options);
  }
}

export class ForbiddenError extends HandlerErrorBase {
  constructor(message: string, public options?: object) {
    super(message, "ForbiddenError", StatusCodes.FORBIDDEN, options);
  }
}

export class UnauthorizedError extends HandlerErrorBase {
  constructor(message: string, public options?: object) {
    super(message, "UnauthorizedError", StatusCodes.UNAUTHORIZED, options);
  }
}

export function assert_param(
  condition: boolean,
  message: string,
  optionalInfo?: object,
): asserts condition {
  if (!condition) {
    throw new BadRequestError(message, optionalInfo);
  }
}

export function assert_exists(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new NotFoundError(message);
  }
}
