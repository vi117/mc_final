import { APIError } from "./error";

export async function postArticle({
  title,
  content,
  category,
  reviewedFundingId,
}: {
  title: string;
  content: string;
  category: string;
  reviewedFundingId?: number;
}) {
  const url = new URL("/api/v1/articles/", window.location.href);
  const r = await fetch(url.href, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      category,
      related_funding_id: reviewedFundingId,
    }),
  });

  if (r.status === 201) {
    return "success";
  } else {
    throw new APIError("postArticle failed");
  }
}
