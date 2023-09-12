import { describe, expect, jest, test } from "@jest/globals";
import { AuthCodeRepository } from "./authCodeRepo";

describe("authCodeRepo", () => {
  test("getAuthCodeRepository", () => {
    const authCodeRepo = new AuthCodeRepository();
    expect(authCodeRepo).toBeDefined();
  });
  test("verifications", () => {
    const authCodeRepo = new AuthCodeRepository();
    const code = authCodeRepo.createVerificationCode("admin@gmail.com");
    expect(code).toBeDefined();
    expect(authCodeRepo.verify(code)).toBe("admin@gmail.com");
  });
  test("expired", () => {
    jest.useFakeTimers();
    const authCodeRepo = new AuthCodeRepository();
    const code = authCodeRepo.createVerificationCode("admin@gmail.com");
    jest.advanceTimersByTime(1000 * 60 * 5 + 1);
    expect(authCodeRepo.verify(code)).toBe(null);
  });
});
