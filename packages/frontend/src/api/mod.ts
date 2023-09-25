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
