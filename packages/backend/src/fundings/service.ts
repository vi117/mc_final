import { safeTransaction } from "@/db/util";
import { FundingsRepository } from "./funding_model";
import { FundingRequestsRepository } from "./request_model";

export class FundingApproveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FundingApproveError";
  }
}

export async function approveFundingRequest(request_id: number) {
  return await safeTransaction(async (db) => {
    const requestRepo = new FundingRequestsRepository(db);
    const fundingRepo = new FundingsRepository(db);
    const request = await requestRepo.findById(request_id);
    if (request === undefined) {
      throw new FundingApproveError("존재하지 않는 요청 ID");
    }
    let funding_id;
    if (request.funding_request_id) {
      funding_id = request.funding_request_id;
      await requestRepo.updateById(request_id, {
        title: request.title,
        content: request.content,
        thumbnail: request.thumbnail,
        target_value: request.target_value,
        // begin_date는 바꿀 수 없다.
        // begin_date: request.begin_date,

        // 그러나 end_date는 바꿀 수 있다. 연장은 가능하다.
        end_date: request.end_date,
        host_id: request.host_id,
      });
    } else {
      funding_id = await fundingRepo.insert({
        title: request.title,
        content: request.content,
        thumbnail: request.thumbnail,
        target_value: request.target_value,
        begin_date: request.begin_date,
        end_date: request.end_date,
        host_id: request.host_id,
      });
      if (funding_id === undefined) {
        throw new FundingApproveError("삽입 실패");
      }
    }
    await requestRepo.updateById(request_id, {
      funding_request_id: funding_id,
    });
  });
}
