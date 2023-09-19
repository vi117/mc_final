import ajv from "@/util/ajv";
import { RouterCatch } from "@/util/util";
import { verify } from "argon2";

import { isDuplKeyError } from "@/db/util";
import upload from "@/file/multer";
import { parseQueryToNumber } from "@/util/query_param";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getAuthCodeRepository } from "./authCodeRepo";
import {
  checkLogin,
  createTokenFromUser,
  deleteAccessTokenFromCookie,
  deleteRefreshTokenFromCookie,
  setAccessTokenToCookie,
  setRefreshTokenToCookie,
} from "./jwt";
import getUserRepository from "./model";
import { sendVerificationMail } from "./sendmail";

const router = Router();

export async function login(req: Request, res: Response): Promise<void> {
  const userRepository = getUserRepository();
  const v = ajv.validate({
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
    required: ["email", "password"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }

  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  const err_msg = "비밀번호가 일치하지 않거나 이메일이 없습니다.";
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: err_msg });
    return;
  }
  if (!await verify(user.password, password)) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: err_msg });
    return;
  }
  if (!user.email_approved) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "이메일 인증이 되지 않았습니다.",
    });
    return;
  }
  setAccessTokenToCookie(res, createTokenFromUser(user, false));
  setRefreshTokenToCookie(res, createTokenFromUser(user, true));
  res.status(StatusCodes.OK).json({
    message: "로그인 성공",
    id: user.id,
    nickname: user.nickname,
    email: user.email,
  });
}

export async function signup(req: Request, res: Response): Promise<void> {
  const file = req.file;

  const v = ajv.validate({
    type: "object",
    properties: {
      nickname: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" },
      address: { type: "string" },
      phone: { type: "string" },
    },
    required: ["nickname", "email", "password", "address", "phone"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }
  const {
    nickname,
    email,
    password,
    address,
    phone,
  } = req.body;
  const userRepository = getUserRepository();
  let user_id: number | undefined;

  try {
    user_id = await userRepository.insert({
      nickname,
      email,
      password,
      address,
      phone,
      profile_image: file?.filename,
    });
    if (user_id === undefined) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 에러" });
      return;
    }
  } catch (e) {
    if (
      isDuplKeyError(e)
    ) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: "중복된 닉네임 혹은 이메일" });
      return;
    } else {
      throw e;
    }
  }
  const verificationCode = getAuthCodeRepository().createVerificationCode(
    email,
  );
  await sendVerificationMail(email, verificationCode);

  res.status(StatusCodes.CREATED).json({
    message: "회원가입 성공",
    user: user_id === undefined ? null : {
      user_id,
      password: null,
    },
  });
}

export const resendVerificationCode = async (req: Request, res: Response) => {
  const v = ajv.validate({
    type: "object",
    properties: {
      email: { type: "string" },
    },
    required: ["email"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }
  const email = req.body.email as string;
  const userRepository = getUserRepository();
  const user = await userRepository.findByEmail(email);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "존재하지 않는 이메일입니다.",
    });
    return;
  }
  if (!user.email_approved) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: "이미 인증된 이메일입니다.",
    });
    return;
  }
  const code = getAuthCodeRepository().createVerificationCode(email);
  await sendVerificationMail(email, code, { resend: true });
  res.status(StatusCodes.OK).json({ message: "인증 코드 재전송 성공" });
};

export const verifyWithCode = async (req: Request, res: Response) => {
  const v = ajv.validate({
    type: "object",
    properties: {
      code: { type: "string" },
    },
    required: ["code"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }

  const { code } = req.body;
  const email = getAuthCodeRepository().verify(code);
  if (email === null) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "인증 코드가 일치하지 않거나 만료 되었습니다.",
    });
    return;
  }
  const userRepository = getUserRepository();
  const updated = await userRepository.approveByEmail(email);
  if (!updated) {
    res
      .status(StatusCodes.CONFLICT)
      .json({ message: "유저가 이미 인증을 받았습니다." });
    return;
  }
  res.status(StatusCodes.OK).json({ message: "인증 성공" });
};

export const logout = (req: Request, res: Response) => {
  deleteAccessTokenFromCookie(res);
  deleteRefreshTokenFromCookie(res);
  res.status(StatusCodes.OK).json({ message: "로그아웃 성공" });
  return;
};

export const queryById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "숫자가 아닌 id를 받을 수 없습니다",
    });
    return;
  }
  const userRepository = getUserRepository();
  const user = await userRepository.findById(id);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json();
    return;
  }
  res.status(StatusCodes.OK).json({
    ...user,
    password: null,
  });
  return;
};

export const queryAll = async (req: Request, res: Response) => {
  const userRepository = getUserRepository();
  const queryParams = req.query;
  const limit = Math.min(
    parseQueryToNumber(queryParams.limit, 50),
    200,
  );
  const offset = parseQueryToNumber(queryParams.offset, 0);
  const users = await userRepository.findAll({
    limit,
    offset,
  });
  res.status(StatusCodes.OK).json(users);
};

router.post("/login", RouterCatch(login));
router.post("/signup", upload.single("profile"), RouterCatch(signup));
router.post("/verify_resend", RouterCatch(resendVerificationCode));
router.post("/verify", RouterCatch(verifyWithCode));
router.post("/logout", RouterCatch(logout));
router.get("/:id", RouterCatch(queryById));
router.get("/", checkLogin({ admin_check: true }), RouterCatch(queryAll));

export default router;
