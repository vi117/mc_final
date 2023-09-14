import assert, { equal } from "node:assert";
import { agent } from "supertest";

import { StatusCodes } from "http-status-codes";

import app from "../../app";
import { getAuthCodeRepository } from "./authCodeRepo";

const insertUser = jest.fn();
const approveByEmail = jest.fn();
const findByEmail = jest.fn();
jest.mock("./model", () => {
  return jest.fn(() => {
    return {
      insert: insertUser,
      approveByEmail,
      findByEmail,
    };
  });
});

const createVerificationCodeMock = jest.fn();
const cleanExpiredMock = jest.fn();
const verifyMock = jest.fn();

jest.mock("./authCodeRepo", () => {
  return {
    getAuthCodeRepository: jest.fn(
      (
        () => {
          return {
            createVerificationCode: createVerificationCodeMock,
            cleanExpired: cleanExpiredMock,
            verify: verifyMock,
          };
        }
      ) as unknown as typeof getAuthCodeRepository,
    ),
  };
});
jest.mock("./../db/util");
jest.mock("../mail/service", () => ({
  getTransport: () => ({
    sendMail: jest.fn(),
  }),
}));

beforeEach(() => {
  insertUser.mockClear();
  createVerificationCodeMock.mockClear();
  cleanExpiredMock.mockClear();
  verifyMock.mockClear();
});

describe("login", () => {
  const fetcher = agent(app);
  const admin_info = {
    nickname: "admin",
    email: "admin@gmail.com",
    password: "$argon2id$v=19$m=32,t=3,p=4$NCRsTXdvSGE$KmytKrvA8u0G0dUV",
    email_approved: true,
  };
  test("login fail : wrong password", async () => {
    findByEmail.mockReturnValue(admin_info);
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "wrong_password",
    });
    equal(res.status, StatusCodes.UNAUTHORIZED);
  });

  test("login fail : wrong email", async () => {
    findByEmail.mockReturnValue(undefined);
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "password",
    });
    equal(res.status, StatusCodes.UNAUTHORIZED);
  });

  test("login fail : email not approved", async () => {
    findByEmail.mockReturnValue({
      ...admin_info,
      email_approved: false,
    });
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "password",
    });
    equal(res.status, StatusCodes.UNAUTHORIZED);
  });

  test("login success", async () => {
    findByEmail.mockReturnValue(admin_info);

    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "test",
    });
    equal(res.status, StatusCodes.OK);
    const cookie = res.headers["set-cookie"] as string[];
    assert(cookie.length >= 2);
    assert(cookie.some((v) => v.includes("access_token=")));
    assert(cookie.some((v) => v.includes("refresh_token=")));
  });

  test("logout", async () => {
    const res = await fetcher.post("/api/users/logout");
    equal(res.status, StatusCodes.OK);
  });
});

describe("signup", () => {
  const fetcher = agent(app);
  const sample_user = {
    nickname: "test",
    email: "test@gmail.com",
    password: "test",
    address: "test",
    phone: "test",
  };
  test("signup fail: nickname already exists", async () => {
    const err = new class extends Error {
      code = "ER_DUP_ENTRY";
    }("ER_DUP_ENTRY");
    insertUser.mockRejectedValue(err);
    const res = await fetcher.post("/api/users/signup").send({
      ...sample_user,
      email: "test",
    });
    equal(res.status, StatusCodes.CONFLICT);
  });
  test("signup success", async () => {
    createVerificationCodeMock.mockReturnValue(
      "6aba8a26-86c0-41f8-a19f-14fa1de41805",
    );
    insertUser.mockReturnValue({
      id: 2,
      ...sample_user,
    });
    const res = await fetcher.post("/api/users/signup").send(sample_user);
    equal(res.status, StatusCodes.OK);
    expect(insertUser).toBeCalledTimes(1);
  });
});

describe("verifyWithCode", () => {
  const fetcher = agent(app);

  // Test case: Valid request
  test("Valid request", async () => {
    verifyMock.mockReturnValue("user@example.com");
    approveByEmail.mockReturnValue(true);

    const res = await fetcher.post("/api/users/verify").send({
      code: "validCode",
    });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject({ message: "인증 성공" });
  });

  test("Invalid code", async () => {
    verifyMock.mockReturnValue(null);

    const res = await fetcher.post("/api/users/verify").send({
      code: "invalidCode",
    });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toMatchObject({
      message: "인증 코드가 일치하지 않거나 만료 되었습니다.",
    });
  });

  test("User already approved", async () => {
    verifyMock.mockReturnValue("user@example.com");
    approveByEmail.mockReturnValue(false);

    const res = await fetcher.post("/api/users/verify").send({
      code: "validCode",
    });

    expect(res.status).toBe(StatusCodes.CONFLICT);
    expect(res.body).toMatchObject({
      message: "유저가 이미 인증을 받았습니다.",
    });
  });
});
