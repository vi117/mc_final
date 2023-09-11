import { verify } from "argon2";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createTokenFromUser,
  deleteAccessTokenFromCookie,
  deleteRefreshTokenFromCookie,
  setAccessTokenToCookie,
  setRefreshTokenToCookie,
} from "./jwt";
import UserRepository from "./model";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "유저를 찾을 수 없습니다." });
  }
  if (!await verify(user.password, password)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  // TODO(vi117): jwt token 설정
  setAccessTokenToCookie(res, createTokenFromUser(user, false));
  setRefreshTokenToCookie(res, createTokenFromUser(user, true));
  return res.status(StatusCodes.OK).json({ message: "로그인 성공" });
});

router.post("/signup", async (req, res) => {
  const {
    nickname,
    email,
    password,
    address,
    phone,
  } = req.body;

  let user = await UserRepository.findByEmail(email);
  if (user) {
    return res.status(StatusCodes.CONFLICT).json({ message: "이미 존재하는 유저입니다." });
  }
  user = await UserRepository.findByNickname(nickname);
  if (user) {
    return res.status(StatusCodes.CONFLICT).json({ message: "이미 존재하는 닉네임입니다." });
  }
  const user_id = await UserRepository.insert({
    nickname,
    email,
    password,
    address,
    phone,
  });
  return res.status(StatusCodes.OK).json({ message: "회원가입 성공", user_id });
});

router.get("/logout", (req, res) => {
  deleteAccessTokenFromCookie(res);
  deleteRefreshTokenFromCookie(res);
  return res.status(StatusCodes.OK).json({ message: "로그아웃 성공" });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "숫자가 아닌 id를 받을 수 없습니다" });
  }
  const user = await UserRepository.findById(id);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "유저를 찾을 수 없습니다." });
  }
  return res.status(StatusCodes.OK).json({
    ...user,
    password: null,
  });
});

export default router;
