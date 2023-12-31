import { API_URL } from "@/config";
import { APIError } from "./error";

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const url = new URL("/api/v1/upload", API_URL);
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError("server error", res.status, data);
  }
  return (await res.json()).url;
}
