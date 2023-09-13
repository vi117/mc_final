import debug_ns from "debug";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserObject } from "./model";
import "./type";
import { StatusCodes } from "http-status-codes";

const debug = debug_ns("joinify:jwt");

if (!process.env.JWT_SECRET) {
  debug("no JWT_SECRET", process.env.JWT_SECRET);
  console.error("no JWT_SECRET");
}

export interface TokenInfo {
  id: number;
  nickname: string;
  is_admin: boolean;
  email_approved: boolean;
}

export function isTokenInfo(obj: object | string): obj is TokenInfo {
  if (typeof obj !== "object") return false;
  return "id" in obj
    && "nickname" in obj
    && "is_admin" in obj
    && "email_approved" in obj
    && typeof obj["is_admin"] == "boolean"
    && typeof obj["email_approved"] == "boolean"
    && typeof obj["id"] == "number"
    && typeof obj["nickname"] == "string";
}

export function createTokenFromUser(user: UserObject, refresh: boolean = false): string {
  return createToken({
    id: user.id,
    nickname: user.nickname,
    is_admin: user.is_admin == 1,
    email_approved: user.email_approved == 1,
  }, refresh);
}

export function createToken(user: TokenInfo, refresh: boolean = false): string {
  return jwt.sign(
    {
      id: user.id,
      nickname: user.nickname,
      is_admin: user.is_admin,
      email_approved: user.email_approved,
      // exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2h
    } as TokenInfo,
    process.env.JWT_SECRET as string,
    {
      expiresIn: refresh ? "14d" : "2h",
    },
  );
}

/**
 * verify access token.
 * it throws error if token is invalid or expired.
 * @param token
 * @returns access token info
 */
export function verifyToken(token: string): TokenInfo {
  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  return payload as TokenInfo;
}

export function checkToken(token: string): TokenInfo | null {
  try {
    const payload = verifyToken(token);
    return payload;
  } catch (e) {
    return null;
  }
}

function getAccessTokenFromCookie(req: Request) {
  return req.cookies.access_token;
}
function getRefreshTokenFromCookie(req: Request) {
  return req.cookies.refresh_token;
}

/**
 * Retrieves the access token from the given request.
 *
 * @param {Request} req - The request object from which to retrieve the access token.
 * @return {string | null} The access token if found, or null if not found.
 */
function getAccessTokenFrom(req: Request): string | null {
  if (!req.headers.authorization) {
    // get token from cookie
    const token = getAccessTokenFromCookie(req);

    if (token) {
      return token;
    }
    return null;
  }
  // get token from header
  // authorization header는
  // Authorization: Bearer ${token}
  // 임.
  const token = req.headers.authorization.split(" ")[1];
  return token;
}

export function setAccessTokenToCookie(res: Response, token: string) {
  res.cookie("access_token", token, {
    maxAge: 1000 * 60 * 60 * 2, // 2h
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    // secure is for https.
    // secure: true,
  });
}

export function setRefreshTokenToCookie(res: Response, token: string) {
  res.cookie("refresh_token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14 day
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    // secure is for https.
    // secure: true,
  });
}

export function deleteAccessTokenFromCookie(res: Response) {
  res.clearCookie("access_token");
}
export function deleteRefreshTokenFromCookie(res: Response) {
  res.clearCookie("refresh_token");
}

/**
 * check access token and set user info to `req.user`
 */
export function tokenCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = getAccessTokenFrom(req);
  if (token == null) {
    req["user"] = null;
    return next();
  }
  const access_info = checkToken(token);
  if (access_info && isTokenInfo(access_info)) {
    req["user"] = access_info;
    return next();
  }
  // access token is invalid
  debug("access token is invalid");
  // attempt to refresh access token
  const new_access_info = getFromRefreshToken();
  if (new_access_info) {
    req["user"] = new_access_info;
  }

  next();
  function getFromRefreshToken() {
    const refresh_token = getRefreshTokenFromCookie(req);
    if (!refresh_token) return;
    const refresh_info = checkToken(refresh_token);
    if (!refresh_info) return;
    debug("refresh access token");
    // refresh access token from refresh token
    const new_access_token = createToken(refresh_info, false);
    setAccessTokenToCookie(res, new_access_token);
    return { ...refresh_info };
  }
}

/**
 * check login middleware
 */
export function checkLogin({ admin_check = false } = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req["user"];
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인이 필요합니다." });
      return;
    }
    if (admin_check && !user.is_admin) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "관리자 계정이 아닙니다." });
      return;
    }
    next();
  };
}
