import ajv from "@/util/ajv";
import { RouterCatch } from "@/util/util";
import { verify } from "argon2";

import { isDuplKeyError } from "@/db/util";
import upload from "@/file/multer";
import {
  assert_param,
  ForbiddenError,
  UnauthorizedError,
} from "@/util/assert_param";
import { parseQueryToNumber, parseQueryToString } from "@/util/query_param";
import assert from "assert";
import debug_fn from "debug";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getAuthCodeRepository, getOauthCodeRepository } from "./authCodeRepo";
import { googleLogin } from "./googleLogin";
import {
  checkLogin,
  deleteAccessTokenFromCookie,
  deleteRefreshTokenFromCookie,
} from "./jwt";
import { setLoginToken } from "./jwt";
import getUserRepository from "./model";
import { sendResetMail, sendVerificationMail } from "./sendmail";

export const debug = debug_fn("joinify:users");
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
  setLoginToken(res, user);
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
      address_detail: { type: "string" },
      phone: { type: "string" },
      token: { type: "string" },
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
    address_detail,
    token,
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
      profile_image: file?.url,
      address_detail: address_detail ?? "",
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
  if (token) {
    const verifyEmail = getOauthCodeRepository().verify(token);
    if (!verifyEmail) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "인증코드가 만료되거나 잘못되었습니다.",
      });
      return;
    }
    if (verifyEmail !== email) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "인증 이메일과 입력이메일이 동일해야합니다.",
      });
      return;
    }
    await userRepository.approveByEmail(email);
    res.status(StatusCodes.OK).json({
      message: "회원가입 성공",
      user: {
        user_id,
        password: null,
      },
    });
    return;
  }
  const verificationCode = getAuthCodeRepository().createVerificationCode(
    email,
  );
  await sendVerificationMail(email, verificationCode);

  res.status(StatusCodes.CREATED).json({
    message: "회원가입 성공",
    user: {
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

export async function sendPasswordReset(req: Request, res: Response) {
  const v = ajv.validate({
    type: "object",
    properties: {
      email: { type: "string" },
    },
    required: ["email"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }
  const email = req.body.email;
  const resetCode = getAuthCodeRepository().createVerificationCode(email, "1h");
  await sendResetMail(email, resetCode);
  console.log(resetCode);

  res.status(StatusCodes.OK).json({
    message: "코드를 보냈습니다.",
  });
}

export async function resetPassword(req: Request, res: Response) {
  const userRepository = getUserRepository();
  const user = req.user;
  const v = ajv.validate({
    type: "object",
    properties: {
      code: { type: "string" },
      password: { type: "string" },
    },
    required: user ? ["password"] : ["code", "password"],
  }, req.body);
  assert_param(v, "유효하지 않은 요청입니다.", {
    errors: ajv.errors,
  });

  let email;
  if (user) {
    email = user.email;
  } else {
    email = getAuthCodeRepository().verify(req.body.code);
    if (!email) {
      throw new UnauthorizedError("만료되었거나 유효하지 않습니다.");
    }
  }

  await userRepository.resetPassword(email, req.body.password);
  res.status(StatusCodes.OK).json({
    message: "success",
  });
}

export const logout = (_req: Request, res: Response) => {
  deleteAccessTokenFromCookie(res);
  deleteRefreshTokenFromCookie(res);
  res.clearCookie("login_user_id");
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
    address: null,
    phone: null,
  });
  return;
};

export const updateUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  if (!req.user?.is_admin && req.user?.id !== id) {
    throw new ForbiddenError("권한이 없습니다.");
  }
  const profile_image = req.file?.url;
  const v = ajv.validate({
    type: "object",
    properties: {
      nickname: { type: "string" },
      address: { type: "string" },
      address_detail: { type: "string" },
      phone: { type: "string" },
      introduction: { type: "string" },
    },
  }, req.body);
  assert_param(v, "유효하지 않은 요청입니다.", {
    errors: ajv.errors,
  });

  const userRepository = getUserRepository();
  await userRepository.updateById(id, {
    address: req.body.address,
    address_detail: req.body.address_detail,
    nickname: req.body.nickname,
    phone: req.body.phone,
    profile_image: profile_image,
    introduction: req.body.introduction,
  });
  const user = await userRepository.findById(id);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "not found" });
    return;
  }
  setLoginToken(res, user);
  res.status(StatusCodes.OK).json({ message: "success" });
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

export const checkEmail = async (req: Request, res: Response) => {
  const userRepository = getUserRepository();
  const email = parseQueryToString(req.query.email);
  if (!email) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "email가 주어지지 않았습니다",
    });
    return;
  }
  const user = await userRepository.findByEmail(email);
  if (user) {
    res.json(false);
    return;
  }
  res.status(StatusCodes.OK).json(true);
};

export const checkNickname = async (req: Request, res: Response) => {
  const userRepository = getUserRepository();
  const nickname = parseQueryToString(req.query.nickname);
  if (!nickname) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "nickname가 주어지지 않았습니다",
    });
    return;
  }
  const user = await userRepository.findByNickname(nickname);
  if (user) {
    res.json(false);
    return;
  }
  res.status(StatusCodes.OK).json(true);
};

router.post("/login", RouterCatch(login));
router.post("/signup", upload.single("profile"), RouterCatch(signup));
router.post("/verify_resend", RouterCatch(resendVerificationCode));
router.post("/verify", RouterCatch(verifyWithCode));
router.post("/reset-password", RouterCatch(resetPassword));
router.post("/send-reset-password", RouterCatch(sendPasswordReset));
router.post("/logout", RouterCatch(logout));
router.post("/google-login", RouterCatch(googleLogin));
router.get("/", checkLogin({ admin_check: true }), RouterCatch(queryAll));
router.get("/:id(\\d+)", RouterCatch(queryById));
router.patch(
  "/:id(\\d+)",
  checkLogin(),
  upload.single("profile"),
  RouterCatch(updateUserById),
);
router.get("/check-email", RouterCatch(checkEmail));
router.get("/check-nickname", RouterCatch(checkNickname));

export default router;
