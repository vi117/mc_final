import { APIError } from "./error";

export async function emailCheck(email: string, signal: AbortSignal) {
  const url = new URL(
    "/api/v1/users/check-email",
    window.location.origin,
  );
  url.searchParams.append("email", email);

  const res = await fetch(url.href, { signal });
  return await res.json();
}

export async function nicknameCheck(nickname: string, signal: AbortSignal) {
  const url = new URL(
    "/api/v1/users/check-nickname",
    window.location.origin,
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
}: {
  Email: string;
  Password: string;
  NickName: string;
  Phone: string;
  Address: string;
  AddressDetail?: string;
  Article: string;
  ProfileImage?: File;
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

  const r = await fetch("/api/v1/users/signup", {
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
  const res = await fetch("/api/v1/users/reset-password", {
    method: "POST",
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
}
