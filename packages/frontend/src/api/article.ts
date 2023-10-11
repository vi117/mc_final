import { API_URL } from "@/config";
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
  const url = new URL("/api/v1/articles/", API_URL);
  const r = await fetch(url.href, {
    method: "POST",
    credentials: "include",
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
    const data = await r.json();
    throw new APIError("postArticle failed", r.status, data);
  }
}

export async function deleteArticle(id: number) {
  const url = new URL(`/api/v1/articles/${id}`, API_URL);
  const res = await fetch(url.href, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError("deleteArticle failed", res.status, data);
  }
}

export async function postArticleComment(id: number, content: string) {
  const url = new URL(
    `/api/v1/articles/${id}/comments`,
    API_URL,
  );
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
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
  const data = await res.json();
  throw new APIError("postArticleComment failed", res.status, data);
}

export async function deleteArticleComment(id: number, commentId: number) {
  const url = new URL(
    `/api/v1/articles/${id}/comments/${commentId}`,
    API_URL,
  );
  const res = await fetch(url.href, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError("deleteArticleComment failed", res.status, data);
  }
}

export async function setArticleLike(id: number, like = true) {
  const url = new URL(`/api/v1/articles/${id}/like`, API_URL);
  if (!like) {
    url.searchParams.append("unlike", "true");
  }
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError("setArticleLike failed", res.status, data);
  }
}

export async function patchArticle(id: number, body: {
  title?: string;
  content?: string;
  category?: string;
  // TODO(vi117): support tag
  // currently, there is no tag
  tags?: string[];
}) {
  const url = new URL(`/api/v1/articles/${id}`, API_URL);
  const res = await fetch(url.href, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError("patchArticle failed", res.status, data);
  }
}

export async function reportArticle(article_id: number, reason: string) {
  const url = new URL(
    `/api/v1/articles/${article_id}/report`,
    API_URL,
  );
  const res = await fetch(url.href, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError("reportArticle failed", res.status, data);
  }
}
