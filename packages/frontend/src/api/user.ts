import { API_URL } from "@/config";
import { loginRevalidate } from "../hook/useLogin";
import { APIError } from "./error";

export async function emailCheck(email: string, signal: AbortSignal) {
  const url = new URL(
    "/api/v1/users/check-email",
    API_URL,
  );
  url.searchParams.append("email", email);

  const res = await fetch(url.href, { signal });
  return await res.json();
}

export async function nicknameCheck(nickname: string, signal: AbortSignal) {
  const url = new URL(
    "/api/v1/users/check-nickname",
    API_URL,
  );
  url.searchParams.append("nickname", nickname);

  const res = await fetch(url.href, { signal });
  return await res.json();
}

export async function signUp({
  Email,
  Password,
  NickName,
  Phone,
  Address,
  AddressDetail,
  Article,
  ProfileImage,
  token,
}: {
  Email: string;
  Password: string;
  NickName: string;
  Phone: string;
  Address: string;
  AddressDetail?: string;
  Article: string;
  ProfileImage?: File;
  token?: string;
}) {
  const formData = new FormData();
  formData.append("email", Email);
  formData.append("password", Password);
  formData.append("nickname", NickName);
  formData.append("phone", Phone);
  formData.append("address", Address);
  formData.append("introduction", Article);

  if (AddressDetail) formData.append("address_detail", AddressDetail);
  if (ProfileImage) formData.append("profile", ProfileImage);
  if (token) formData.append("token", token);

  const url = new URL("/api/v1/users/signup", API_URL);
  const r = await fetch(url.href, {
    method: "POST",
    body: formData,
  });
  const msg = await r.json();
  if (r.status === 201) {
    /// 회원가입 성공!
    return [true, msg.message];
  } else {
    /// 회원 가입 실패!
    return [false, msg.message];
  }
}

/**
 * Resets the password for a user.
 *
 * @param {string} password - The new password.
 * @param {string} [code] - The reset code (optional) to verify.
 * it used for non local users.
 * @return {Promise<void>} - A promise that resolves when the password reset is successful.
 * @throws {APIError} - If the token(`code`) has expired or is invalid
 */
export async function resetPassword(password: string, code?: string) {
  const url = new URL("/api/v1/users/reset-password", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      code,
      password,
    }),
  });
  if (!res.ok) {
    throw new APIError("token expired or invalid");
  }
  loginRevalidate();
}
/**
 * Authenticates a user by sending a login request to the server.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @return {Promise<[boolean, object]>} - A promise that resolves to a boolean indicating whether the login was successful and an object containing the user's data.
 */
export async function login(
  email: string,
  password: string,
): Promise<
  [false, {
    message: string;
    code: "not_found" | "not_approved";
  }] | [
    true,
    {
      message: string;
      id: number;
      email: string;
      nickname: string;
    },
  ]
> {
  const url = new URL("/api/v1/users/login", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    return [false, data];
  }
  loginRevalidate();
  return [true, await res.json()];
}

/**
 * Sends a reset password email to the specified email address.
 *
 * @param {string} email - The email address to send the reset password email to.
 * @return {Promise<boolean>} - A promise that resolves to true if the reset password email was successfully sent, and false otherwise.
 */
export async function sendResetPassword(email: string) {
  // it equals 'await axios.post("/api/v1/users/send-reset-password", {email});'
  const url = new URL("/api/v1/users/send-reset-password", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError(data.message);
  }
}

export async function resendVerification(email: string) {
  const url = new URL("/api/v1/users/send-verification", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError(data.message);
  }
}

export async function patchUserInfo(id: number, body: {
  nickname?: string;
  phone?: string;
  address?: string;
  address_detail?: string;
  introduction?: string;
  profile_image?: File;
}) {
  const formData = new FormData();
  if (body.nickname) formData.append("nickname", body.nickname);
  if (body.phone) formData.append("phone", body.phone);
  if (body.address) formData.append("address", body.address);
  if (body.address_detail) {
    formData.append("address_detail", body.address_detail);
  }
  if (body.introduction) formData.append("introduction", body.introduction);
  if (body.profile_image) formData.append("profile", body.profile_image);

  const url = new URL(`/api/v1/users/${id}`, API_URL);
  const res = await fetch(url.href, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    throw new APIError("token expired or invalid");
  }
  loginRevalidate();
  return await res.json();
}

/**
 * Logs the user out by making a POST request to the "/api/v1/users/logout" endpoint.
 *
 * @return {Promise<void>} Returns a promise that resolves when the logout request is complete.
 */
export async function logout(): Promise<void> {
  const url = new URL("/api/v1/users/logout", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
  });
  loginRevalidate();
  if (res.status !== 200) {
    throw new APIError("token expired or invalid");
  }
  console.log("logout success");
}

export async function verifyUserEmail(code: string) {
  const url = new URL("/api/v1/users/verify", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      code: code,
    }),
  });
  if (!res.ok) {
    throw new APIError("token expired or invalid");
  }
}

export async function googleLogin(code: string): Promise<{
  message: string;
  code:
    | "need_signup"
    | "success"
    | "invalid_request"
    | "token_error"
    | "payload_error";
  data?: {
    token: string;
    email: string;
    name: string;
  };
}> {
  const url = new URL("/api/v1/users/google-login", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  if (!res.ok) {
    return await res.json();
  }
  const resJson = await res.json();
  return resJson;
}
