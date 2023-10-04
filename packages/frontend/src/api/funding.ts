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

export async function setFundingInterest(id: number, like = true) {
  const url = new URL(
    `/api/v1/fundings/${id}/interest`,
    window.location.origin,
  );
  url.searchParams.append("disset", (!like) ? "true" : "false");
  const res = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status === 401) {
    // need login
    return "Unauthorized";
  } else if (res.status === 409) {
    // already set
    return "Conflict";
  } else {
    return "OK";
  }
}

export async function fundingApprove(id: number) {
  const url = new URL(
    `/api/v1/fundings/request/${id}/approve`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError(data.message);
  }
}

export async function fundingReject(id: number) {
  const url = new URL(
    `/api/v1/fundings/request/${id}/reject`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError(data.message);
  }
}

export async function fundingDelete(id: number) {
  const url = new URL(
    `/api/v1/fundings/${id}`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new APIError(data.message);
  }
}
