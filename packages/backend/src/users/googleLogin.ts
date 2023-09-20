import ajv from "@/util/ajv";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { decode as jwtDecode } from "jsonwebtoken";
import { getOauthCodeRepository } from "./authCodeRepo";
import { setLoginToken } from "./jwt";
import getUserRepository from "./model";
import { debug } from "./router";

export async function googleLogin(req: Request, res: Response) {
  const v = ajv.validate({
    type: "object",
    properties: {
      code: { type: "string" },
    },
    required: ["code"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }

  const code = req.body.code;
  const token = await requestTokenFromGoogle(code);

  if (!token.ok) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 에러: ",
    });
    debug(await token.text());
    return;
  }

  const data = await token.json();
  const id_token = data.id_token;
  const id_token_payload = await jwtDecode(id_token) as null | {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
  };
  if (!id_token_payload) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 에러",
    });
    debug("token error!", id_token);
    return;
  }

  const email = id_token_payload.email;
  const userRepository = getUserRepository();

  const user = await userRepository.findByEmail(email);
  if (!user) {
    const token = getOauthCodeRepository().createVerificationCode(email);

    res.status(StatusCodes.OK).json({
      message: "회원가입이 필요합니다.",
      code: "need_signup",
      token,
    });
    return;
  }
  if (!user.email_approved) {
    await userRepository.approveByEmail(email);
  }

  // if user is exist, login
  setLoginToken(res, user);
  res.status(StatusCodes.OK).json({
    message: "success",
    code: "success",
    id: user.id,
  });
}

async function requestTokenFromGoogle(code: string) {
  const googleAuthEndpoint = "https://oauth2.googleapis.com/token";
  const client_id = process.env.GOOGLE_CLIENT_ID ?? "";
  const client_secret = process.env.GOOGLE_CLIENT_SECRET ?? "";
  const redirect_uri = process.env.GOOGLE_REDIRECT_URI ?? "";

  const body = new URLSearchParams({
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  }).toString();
  const token = await fetch(googleAuthEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });
  return token;
}
