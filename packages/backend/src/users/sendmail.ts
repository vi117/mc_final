import { getTransport } from "@/mail/service";

interface SendVerificationMailOptions {
  resend?: boolean;
}

export async function sendVerificationMail(
  email: string,
  verificationCode: string,
  _options?: SendVerificationMailOptions,
) {
  const transporter = getTransport();
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `no-reply@${process.env.SMTP_HOST}`,
    to: email,
    subject: "회원가입 인증 코드",
    text:
      `회원가입 인증 코드는 ${verificationCode} 입니다. 이 코드를 입력해주세요.`,
    headers: {
      "content-type": "text/plain",
    },
  });
}
