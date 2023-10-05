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
 * @param {string} [reason] - The reason for rejecting the request.
 * @return {Promise<void>} - A promise that resolves when the request is successfully rejected.
 */
export async function fundingReject(id: number, reason?: string) {
  const url = new URL(
    `/api/v1/fundings/request/${id}/reject`,
    window.location.origin,
  );
  const res = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: reason ?? "",
    }),
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

export async function postFundingRequest({
  title,
  content,
  contentThumbnails,
  targetValue,
  thumbnail,
  startDate,
  endDate,
  tags,
  rewards,
  accountNumber,
  certificateFiles,
}: {
  title: string;
  content: string;
  thumbnail: File;
  contentThumbnails: File[];
  targetValue: number;
  startDate: Date;
  endDate: Date;
  tags: string[];
  rewards: {
    title: string;
    content: string;
    price: number;
    reward_count: number;
  }[];
  accountNumber: string;
  certificateFiles: File[];
}) {
  const url = new URL("/api/v1/fundings/request", window.location.href);

  const formData = new FormData();

  formData.append("title", title);
  formData.append("thumbnail", thumbnail);
  [...contentThumbnails].forEach((file) => {
    formData.append("content_thumbnail", file);
  });
  formData.append("content", content);
  formData.append("target_value", targetValue.toString());
  formData.append("begin_date", startDate.toISOString());
  formData.append("end_date", endDate.toISOString());
  formData.append("tags", tags.toString());
  formData.append("rewards", JSON.stringify(rewards));

  formData.append("account_number", accountNumber);
  [...certificateFiles].forEach((file) => {
    formData.append("certificate", file);
  });
  console.log(formData);

  const r = await fetch(url.href, {
    method: "POST",
    body: formData,
  });

  if (!r.ok) {
    const data = await r.json();
    throw new APIError(data.message);
  }
}
