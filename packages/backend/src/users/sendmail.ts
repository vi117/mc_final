import { getTransport } from "@/mail/service";
import debug_fn from "debug";
import verifyTemplate from "./mail_form";

const debug = debug_fn("joinify:sendmail");

interface SendVerificationMailOptions {
  resend?: boolean;
}

export async function sendVerificationMail(
  email: string,
  verificationCode: string,
  _options?: SendVerificationMailOptions,
) {
  const transporter = getTransport();
  debug("sendVerificationMail", { email, verificationCode });
  if (!process.env.SERVER_URL) {
    debug("SERVER_URL is not set");
  }
  const frontendUrl = new URL(
    process.env.SERVER_URL ?? "http://localhost:5173",
  );
  frontendUrl.pathname = `/approve-email`;
  frontendUrl.searchParams.set("code", verificationCode);
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `no-reply@${process.env.SMTP_HOST}`,
    to: email,
    subject: "회원가입 인증 코드",
    text: verifyTemplate({
      frontendUrl: frontendUrl.href,
      title: "이메일 주소 확인",
      body: "아래 링크를 클릭해서 인증해주세요.",
    }),
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
  debug("sendResetMail", { email, resetCode });
  if (!process.env.SERVER_URL) {
    debug("SERVER_URL is not set");
  }
  const frontendUrl = new URL(
    process.env.SERVER_URL ?? "http://localhost:5173",
  );
  frontendUrl.pathname = `/reset-password`;
  frontendUrl.searchParams.set("code", resetCode);
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `no-reply@${process.env.SMTP_HOST}`,
    to: email,
    subject: "비밀 번호 재설정 코드",
    text: verifyTemplate({
      frontendUrl: frontendUrl.href,
      title: "비밀번호 재설정",
      body: "아래 링크를 클릭하여 비밀번호를 재설정해주세요.",
    }),
    headers: {
      "content-type": "text/html",
    },
  });
}
