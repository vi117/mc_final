import { TokenInfo } from "./jwt";

declare global {
  namespace Express {
    export interface Request {
      user: TokenInfo | null;
    }
  }
}
