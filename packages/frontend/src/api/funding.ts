import { API_URL } from "@/config";
import { APIError } from "./error";

export async function withdrawFunding(id: number, selectedReward_id: number) {
  const url = new URL(
    `/api/v1/fundings/${id}/rewards/${selectedReward_id}/withdraw`,
    API_URL,
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
    API_URL,
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
    API_URL,
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
    API_URL,
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
    API_URL,
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
    API_URL,
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
  accountBankName,
  funding_id,
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
  accountBankName: string;
  certificateFiles: File[];
  funding_id?: number;
}) {
  const url = new URL("/api/v1/fundings/request", API_URL);

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
  formData.append("account_bank_name", accountBankName);
  [...certificateFiles].forEach((file) => {
    formData.append("certificate", file);
  });
  if (funding_id) {
    formData.append("funding_id", funding_id.toString());
  }

  const r = await fetch(url.href, {
    method: "POST",
    body: formData,
  });

  if (!r.ok) {
    const data = await r.json();
    throw new APIError(data.message);
  }
}

export async function postFundingRequestAsJson(obj: {
  funding_id?: number;
  title: string;
  content: string;
  thumbnail: string;
  contentThumbnails: string[];
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
  accountBankName: string;
  certificateFiles: string[];
}) {
  const url = new URL("/api/v1/fundings/request", API_URL);

  const r = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      funding_id: obj.funding_id,
      title: obj.title,
      content: obj.content,
      thumbnail: obj.thumbnail,
      content_thumbnails: obj.contentThumbnails,
      target_value: obj.targetValue,
      begin_date: obj.startDate.toISOString(),
      end_date: obj.endDate.toISOString(),
      tags: obj.tags,
      rewards: obj.rewards,
      account_number: obj.accountNumber,
      account_bank_name: obj.accountBankName,
      certificate: obj.certificateFiles,
    }),
  });
  if (!r.ok) {
    const data = await r.json();
    throw new APIError(data.message);
  }
}

export async function postFundingReport(funding_id: number, {
  content,
}: {
  content: string;
  attachment: File[];
}) {
  const url = new URL(
    `/api/v1/fundings/${funding_id}/report`,
    API_URL,
  );
  const formData = new FormData();
  formData.append("content", content);
  [...content].forEach((file) => {
    formData.append("attachment", file);
  });
  const r = await fetch(url.href, {
    method: "POST",
    body: formData,
  });
  if (!r.ok) {
    const data = await r.json();
    throw new APIError(data.message);
  }
}
