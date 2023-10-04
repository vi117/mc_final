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

/**
 * Approves funding request with the given ID.
 *
 * @param {number} id - The ID of the funding request to be approved.
 * @return {Promise<void>} - A promise that resolves with no value.
 */
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

/**
 * Rejects a funding request with the given ID.
 *
 * @param {number} id - The ID of the funding request to reject.
 * @return {Promise<void>} - A promise that resolves when the request is successfully rejected.
 */
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

/**
 * Soft-deletes a funding record by ID.
 * 펀딩
 *
 * @param {number} id - The ID of the funding record to delete.
 * @return {Promise<void>} - A promise that resolves with no value.
 */
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

export async function fundingParticipate(id: number, reward_id: number, body: {
  address: string;
  addressDetail: string;
  recipient: string;
  phone: string;
}) {
  const url = new URL(
    `/api/v1/fundings/${id}/rewards/${reward_id}/participate`,
    window.location.href,
  );
  const r = await fetch(url.href, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      address: body.address + body.addressDetail,
      recipient: body.recipient,
      phone: body.phone,
    }),
  });
  if (!r.ok) {
    const data = await r.json();
    throw new APIError(data.message);
  }
}
