import { createTransport, Transporter } from "nodemailer";

let transporter: null | Transporter = null;
let usingCount = 0;

export function getTransport() {
  if (!transporter) {
    transporter = createTransport({
      host: process.env.SMTP_HOST ?? "",
      port: parseInt(process.env.SMTP_PORT ?? ""),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER ?? "",
        pass: process.env.SMTP_PASSWORD ?? "",
      },
    });
  }
  usingCount++;
  setTimeout(() => {
    usingCount--;
    if (usingCount === 0 && transporter) {
      transporter.close();
      transporter = null;
    }
  }, 100);
  return transporter;
}

export default getTransport();
