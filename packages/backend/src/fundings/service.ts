import { isDuplKeyError, safeTransaction } from "@/db/util";
import {
  FundingRewardsRepository,
  FundingsRepository,
  FundingUsersRepository,
} from "./funding_model";
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
    } else if (request.funding_state === 1) {
      throw new FundingApproveError("이미 승인된 요청입니다");
    } else if (request.funding_state === 2) {
      throw new FundingApproveError("이미 취소된 요청입니다");
    }
    const meta = request.meta_parsed ?? undefined;

    let result_funding_id: number | undefined;
    if (request.funding_request_id) {
      const funding_id = request.funding_request_id;
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
      // TODO(vi117): update  difference of tags.
      result_funding_id = funding_id;
    } else {
      if (meta === undefined) {
        throw new FundingApproveError("meta does not exist");
      }
      const funding_id = await fundingRepo.insert({
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
      await fundingRepo.insertTagsByName(funding_id, meta.tags);
      await fundingRepo.insertRewards(meta.rewards.map((r) => ({
        title: r.title,
        content: r.content,
        price: r.price,
        reward_count: r.reward_count,
        funding_id: funding_id,
      })));

      result_funding_id = funding_id;
    }
    await requestRepo.updateById(request_id, {
      funding_request_id: result_funding_id,
    });
  });
}

export class FundingUsersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FundingParticipateError";
  }
}

export async function participateFunding({
  user_id,
  funding_id,
  reward_id,
  address,
}: {
  user_id: number;
  funding_id: number;
  reward_id: number;
  address: string;
}) {
  return await safeTransaction(async (db) => {
    try {
      await new FundingUsersRepository(db).insert({
        user_id,
        funding_id,
        reward_id,
        address,
      });
    } catch (error) {
      if (isDuplKeyError(error)) {
        throw new FundingUsersError("already participated");
      }
      throw error;
    }

    const rewardRepo = new FundingRewardsRepository(db);
    const reward = await rewardRepo.findById(reward_id);
    if (reward === undefined) {
      throw new FundingUsersError("reward does not exist");
    }
    if (reward.reward_current_count >= reward.reward_count) {
      throw new FundingUsersError("reward is full");
    }
    reward.reward_current_count += 1;
    rewardRepo.updateById(reward_id, reward);

    const fundingRepo = new FundingsRepository(db);
    fundingRepo.addCurrentValue(funding_id, reward.price);
  });
}
export async function withdrawFunding({
  user_id,
  funding_id,
  reward_id,
}: {
  user_id: number;
  funding_id: number;
  reward_id: number;
}) {
  return await safeTransaction(async (db) => {
    await new FundingUsersRepository(db).deleteByUserIdAndFundingId(
      user_id,
      funding_id,
    );
    const rewardRepo = new FundingRewardsRepository(db);
    const reward = await rewardRepo.findById(reward_id);
    if (reward === undefined) {
      throw new FundingUsersError("reward does not exist");
    }
    if (reward.reward_current_count <= 0) {
      throw new FundingUsersError("reward is empty");
    }
    reward.reward_current_count -= 1;
    rewardRepo.updateById(reward_id, reward);

    const fundingRepo = new FundingsRepository(db);
    fundingRepo.addCurrentValue(funding_id, -reward.price);
  });
}
