import { randomUUID } from "crypto";

type VerifyCodeType = string;

/**
 * 사용자가 생성될 때 사용자가 이메일을 가지고 있는지 확인하는 저장소입니다.
 */
export class AuthCodeRepository {
  userMap: Map<VerifyCodeType, string>;
  dateMap: Map<number, VerifyCodeType>;

  constructor() {
    this.userMap = new Map();
    this.dateMap = new Map();
  }

  cleanExpired() {
    const age = 5 * 60 * 1000;
    for (const time of this.dateMap.keys()) {
      if (time + age < Date.now()) {
        const key = this.dateMap.get(time);
        this.dateMap.delete(time);
        if (key === undefined) {
          // this should not happen
          throw new Error("unreachable!");
        }
        this.userMap.delete(key);
      }
    }
  }

  createVerificationCode(email: string) {
    const key = randomUUID();
    this.userMap.set(key, email);
    this.dateMap.set(Date.now(), key);
    return key;
  }

  /**
   * Verifies the given code and retrieves the associated email address.
   *
   * @param {VerifyCodeType} code - The verification code to be checked.
   * @return {string | null} - The email address associated with the code, or null if the code is invalid.
   */
  verify(code: VerifyCodeType): string | null {
    this.cleanExpired();
    const email = this.userMap.get(code);
    if (email === undefined) {
      return null;
    }
    return email;
  }
}

const authCodeRepository: AuthCodeRepository = new AuthCodeRepository();
export function getAuthCodeRepository(): AuthCodeRepository {
  return authCodeRepository;
}

export default getAuthCodeRepository;
