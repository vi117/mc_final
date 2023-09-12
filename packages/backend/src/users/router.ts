import { safeTransaction } from "@/db/util";
import { getTransport } from "@/mail/service";
import ajv from "@/util/ajv";
import { RouterCatch } from "@/util/util";
import { verify } from "argon2";
import assert from "assert";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import getAuthCodeRepository from "./authCodeRepo";
import {
  createTokenFromUser,
  deleteAccessTokenFromCookie,
  deleteRefreshTokenFromCookie,
  setAccessTokenToCookie,
  setRefreshTokenToCookie,
} from "./jwt";
import getUserRepository from "./model";

const router = Router();

export async function login(req: Request, res: Response): Promise<void> {
  const userRepository = getUserRepository();
  const v = ajv.validate({
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    required: ["email", "password"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다.", errors: ajv.errors });
    return;
  }

  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "유저를 찾을 수 없습니다." });
    return;
  }
  if (!await verify(user.password, password)) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "비밀번호가 일치하지 않습니다." });
    return;
  }
  setAccessTokenToCookie(res, createTokenFromUser(user, false));
  setRefreshTokenToCookie(res, createTokenFromUser(user, true));
  res.status(StatusCodes.OK).json({ message: "로그인 성공" });
}
router.post("/login", RouterCatch(login));

export async function signup(req: Request, res: Response): Promise<void> {
  const v = ajv.validate({
    type: "object",
    properties: {
      nickname: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      address: { type: "string" },
      phone: { type: "string" },
    },
    required: ["nickname", "email", "password", "address", "phone"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다.", errors: ajv.errors });
    return;
  }
  const {
    nickname,
    email,
    password,
    address,
    phone,
  } = req.body;

  const [isError, user, user_id] = await safeTransaction(async trx => {
    const userRepository = getUserRepository(trx);
    let user = await userRepository.findByEmail(email);
    if (!user) {
      res.status(StatusCodes.CONFLICT).json({ message: "이미 존재하는 유저입니다." });
      return [true, undefined, undefined];
    }
    user = await userRepository.findByNickname(nickname);
    if (user === undefined) {
      res.status(StatusCodes.CONFLICT).json({ message: "이미 존재하는 닉네임입니다." });
      return [true, undefined, undefined];
    }
    const user_id = await userRepository.insert({
      nickname,
      email,
      password,
      address,
      phone,
    });
    if (user_id === undefined) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 에러" });
      return [true, undefined, undefined];
    }
    return [false, user, user_id];
  });
  if (isError) {
    return;
  }

  assert(user !== undefined, "unexpected error");
  assert(user_id !== undefined, "unexpected error");

  setAccessTokenToCookie(res, createTokenFromUser(user, false));
  setRefreshTokenToCookie(res, createTokenFromUser(user, true));
  res.status(StatusCodes.CREATED).json({ message: "회원가입 성공" });

  const verificationCode = getAuthCodeRepository().createVerificationCode(email);
  await getTransport().sendMail({
    from: process.env.SMTP_FROM ?? `no-reply@${process.env.SMTP_HOST}`,
    to: email,
    subject: "회원가입 인증 코드",
    text: `회원가입 인증 코드는 ${verificationCode} 입니다. 이 코드를 입력해주세요.`,
    headers: {
      "content-type": "text/plain",
    },
  });
  res.status(StatusCodes.OK).json({ message: "회원가입 성공", user_id: user_id.toString() });
}
router.post("/signup", RouterCatch(signup));

export const verifyWithCode = async (req: Request, res: Response) => {
  const v = ajv.validate({
    type: "object",
    properties: {
      code: { type: "string" },
    },
    required: ["code"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다.", errors: ajv.errors });
    return;
  }

  const { code } = req.body;
  const email = getAuthCodeRepository().verify(code);
  if (email === null) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "인증 코드가 일치하지 않거나 만료 되었습니다." });
    return;
  }
  const userRepository = getUserRepository();
  const updated = await userRepository.approveByEmail(email);
  if (!updated) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "유저를 찾을 수 없습니다." });
    return;
  }
  res.status(StatusCodes.OK).json({ message: "인증 성공" });
};
router.post("/verify", RouterCatch(verifyWithCode));

export const logout = (req: Request, res: Response) => {
  deleteAccessTokenFromCookie(res);
  deleteRefreshTokenFromCookie(res);
  res.status(StatusCodes.OK).json({ message: "로그아웃 성공" });
  return;
};

router.get("/logout", RouterCatch(logout));

export const queryById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "숫자가 아닌 id를 받을 수 없습니다" });
    return;
  }
  const userRepository = getUserRepository();
  const user = await userRepository.findById(id);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "유저를 찾을 수 없습니다." });
    return;
  }
  res.status(StatusCodes.OK).json({
    ...user,
    password: null,
  });
  return;
};
router.get("/:id", RouterCatch(queryById));

export default router;
