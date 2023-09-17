import jwt from "jsonwebtoken";

type VerifyCodeType = string;

/**
 * 사용자가 생성될 때 사용자가 이메일을 가지고 있는지 확인하는 저장소입니다.
 */
export class AuthCodeRepository {
  constructor() {
  }

  createVerificationCode(email: string) {
    const content = {
      email: email,
    };
    const secret = (process.env.JWT_SECRET as string) + "verificationCode";
    const token = jwt.sign(content, secret, {
      expiresIn: "5m",
    });
    return token;
  }

  /**
   * Verifies the given code and retrieves the associated email address.
   *
   * @param {VerifyCodeType} code - The verification code to be checked.
   * @return {string | null} - The email address associated with the code, or null if the code is invalid.
   */
  verify(code: VerifyCodeType): string | null {
    try {
      const payload = jwt.verify(code, process.env.JWT_SECRET as string);
      const content = payload as { email: string };
      const email = content.email;
      if (email === undefined) {
        return null;
      }
      return email;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return null;
      }
      throw e;
    }
  }
}

const authCodeRepository: AuthCodeRepository = new AuthCodeRepository();
export function getAuthCodeRepository(): AuthCodeRepository {
  return authCodeRepository;
}
