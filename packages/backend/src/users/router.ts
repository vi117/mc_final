import { verify } from "argon2";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
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
router.post("/login", login);

export async function signup(req: Request, res: Response): Promise<void> {
  const userRepository = getUserRepository();
  const {
    nickname,
    email,
    password,
    address,
    phone,
  } = req.body;

  let user = await userRepository.findByEmail(email);
  if (user) {
    res.status(StatusCodes.CONFLICT).json({ message: "이미 존재하는 유저입니다." });
    return;
  }
  user = await userRepository.findByNickname(nickname);
  if (user) {
    res.status(StatusCodes.CONFLICT).json({ message: "이미 존재하는 닉네임입니다." });
    return;
  }
  const user_id = await userRepository.insert({
    nickname,
    email,
    password,
    address,
    phone,
  });
  // TODO: send verification email using SMTP
  res.status(StatusCodes.OK).json({ message: "회원가입 성공", user_id });
  return;
}
router.post("/signup", signup);

export const logout = (req: Request, res: Response) => {
  deleteAccessTokenFromCookie(res);
  deleteRefreshTokenFromCookie(res);
  res.status(StatusCodes.OK).json({ message: "로그아웃 성공" });
  return;
};
router.get("/logout", logout);

export const queryById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "숫자가 아닌 id를 받을 수 없습니다" });
  }
  const userRepository = getUserRepository();
  const user = await userRepository.findById(id);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "유저를 찾을 수 없습니다." });
  }
  return res.status(StatusCodes.OK).json({
    ...user,
    password: null,
  });
};
router.get("/:id", queryById);

export default router;
