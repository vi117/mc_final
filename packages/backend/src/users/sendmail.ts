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
  const frontendUrl = new URL(process.env.SERVER_URL ?? "");
  frontendUrl.pathname = `/approve-email`;
  frontendUrl.searchParams.set("code", verificationCode);
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `no-reply@${process.env.SMTP_HOST}`,
    to: email,
    subject: "회원가입 인증 코드",
    text: `회원가입 인증 코드는 ${verificationCode} 입니다.
      이 <a href="${frontendUrl.href}">링크</a>를 클릭해서 인증해주세요.`,
    headers: {
      "content-type": "text/html",
    },
  });
}

export async function sendResetMail(
  email: string,
  resetCode: string,
) {
  const transporter = getTransport();
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `no-reply@${process.env.SMTP_HOST}`,
    to: email,
    subject: "비밀 번호 재설정 코드",
    text: `비밀번호 재설정 코드는 ${resetCode} 입니다. 이 코드를 입력해주세요.`,
    headers: {
      "content-type": "text/plain",
    },
  });
}
