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

  if (!r.ok) {
    throw new APIError("postArticle failed");
  }
}

export async function deleteArticle(id: number) {
  const url = new URL(`/api/v1/articles/${id}`, window.location.origin);
  const res = await fetch(url.href, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new APIError("deleteArticle failed");
  }
}

export async function postArticleComment(id: number, content: string) {
  const url = new URL(
    `/api/v1/articles/${id}/comments`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });
  const resJson = await res.json();
  if (res.status == 201) {
    return {
      id: resJson.inserted_id,
      content,
    };
  }
  throw new APIError("postArticleComment failed");
}

export async function deleteArticleComment(id: number, commentId: number) {
  const url = new URL(
    `/api/v1/articles/${id}/comments/${commentId}`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new APIError("deleteArticleComment failed");
  }
}

export async function setArticleLike(id: number, like = true) {
  const url = new URL(`/api/v1/articles/${id}/like`, window.location.origin);
  if (!like) {
    url.searchParams.append("unlike", "true");
  }
  const res = await fetch(url.href, {
    method: "POST",
  });
  if (!res.ok) {
    throw new APIError("setArticleLike failed");
  }
}
