import assert, { equal } from "node:assert";
import { agent } from "supertest";

import app from "../../app";
import { MockUserRepository } from "./__mocks__/model";
import getAuthCodeRepository from "./authCodeRepo";
import getUserRepository from "./model";

const insertUser = jest.fn();
jest.mock("./model", () => {
  return jest.fn().mockImplementation(() => {
    return new class extends MockUserRepository {
      async insert(...args: unknown[]) {
        return insertUser(...args);
      }
    }();
  });
});
jest.mock("./authCodeRepo");
jest.mock("./../db/util");
jest.mock("../mail/service", () => ({
  getTransport: () => ({
    sendMail: jest.fn(),
  }),
}));

const mockGetUserRepository = getUserRepository as jest.MockedFunction<typeof getUserRepository>;
const mockGetAuthCodeRepo = getAuthCodeRepository as jest.MockedFunction<typeof getAuthCodeRepository>;

beforeEach(() => {
  mockGetUserRepository.mockClear();
  mockGetAuthCodeRepo.mockClear();
});

describe("login", () => {
  const fetcher = agent(app);

  test("login fail", async () => {
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "wrong_password",
    });
    equal(res.status, 401);
  });

  test("login success", async () => {
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "test",
    });
    equal(res.status, 200);
    const cookie = res.headers["set-cookie"];
    assert(cookie.length >= 2);
  });

  test("logout", async () => {
    const res = await fetcher.post("/api/users/logout");
    equal(res.status, 200);
  });
});

describe("signup", () => {
  const fetcher = agent(app);

  test("signup fail: nickname already exists", async () => {
    const err = new class extends Error {
      code = "ER_DUP_ENTRY";
    }("ER_DUP_ENTRY");
    insertUser.mockRejectedValue(err);
    mockGetAuthCodeRepo.mockImplementation(
      jest.fn().mockReturnValue({
        createVerificationCode: jest.fn(),
        cleanExpired: jest.fn(),
        verify: jest.fn(),
      }),
    );
    const res = await fetcher.post("/api/users/signup").send({
      nickname: "admin",
      email: "test",
      password: "test",
      address: "test",
      phone: "test",
    });
    equal(res.status, 409);
  });
  test("signup success", async () => {
    mockGetAuthCodeRepo.mockImplementation(
      (
        () => {
          return {
            createVerificationCode: jest.fn().mockReturnValue("6aba8a26-86c0-41f8-a19f-14fa1de41805"),
            cleanExpired: jest.fn(),
            verify: jest.fn(),
          };
        }
      ) as unknown as typeof getAuthCodeRepository,
    );
    insertUser.mockReturnValue({
      id: 2,
      nickname: "test",
      email: "test@example.com",
      password: "test",
      address: "test",
      phone: "test",
    });
    const res = await fetcher.post("/api/users/signup").send({
      nickname: "test",
      email: "test@example.com",
      password: "test",
      address: "test",
      phone: "test",
    });
    equal(res.status, 200);
    expect(insertUser).toBeCalledTimes(1);
  });
});
