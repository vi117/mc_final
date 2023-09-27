import { APIError } from "./error";

export async function withdrawFunding(id: number, selectedReward_id: number) {
  const url = new URL(
    `/api/v1/fundings/${id}/rewards/${selectedReward_id}/withdraw`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError(data.message);
  }
}
