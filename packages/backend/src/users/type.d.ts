import { AccessTokenInfo, RefreshTokenInfo } from "./jwt";

declare global {
  namespace Express {
    export interface Request {
      user: AccessTokenInfo;
      refreshToken: RefreshTokenInfo;
    }
  }
}
