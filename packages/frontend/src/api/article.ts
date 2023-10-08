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

export async function patchArticle(id: number, body: {
  title?: string;
  content?: string;
  category?: string;
  // TODO(vi117): support tag
  // currently, there is no tag
  tags?: string[];
}) {
  const url = new URL(`/api/v1/articles/${id}`, window.location.origin);
  const res = await fetch(url.href, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new APIError("patchArticle failed");
  }
}

export async function reportArticle(article_id: number, reason: string) {
  const url = new URL(
    `/api/v1/articles/${article_id}/report`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason,
    }),
  });
  if (!res.ok) {
    throw new APIError("reportArticle failed");
  }
}
