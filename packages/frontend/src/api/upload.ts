import { APIError } from "./error";

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, file.name);
  const url = new URL("/api/v1/upload", window.location.origin);
  const res = await fetch(url.href, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new APIError("server error");
  }
  return (await res.json()).url;
}
