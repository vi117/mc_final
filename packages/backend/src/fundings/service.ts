import { isDuplKeyError, safeTransaction } from "@/db/util";
import {
  FundingRewardsRepository,
  FundingsRepository,
  FundingTagRepo,
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
    const fundingTagRepo = new FundingTagRepo(db);

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
      // edit existing funding
      const funding_id = request.funding_request_id;
      const funding = await fundingRepo.findById(funding_id);
      if (funding === undefined) {
        throw new FundingApproveError("funding does not exist");
      }
      if (funding.end_date.getTime() < Date.now()) {
        throw new FundingApproveError("funding is expired");
      }
      // if (funding.deleted_at !== null) {
      // throw new FundingApproveError("funding is deleted");
      // }
      if (funding.host_id !== request.host_id) {
        throw new FundingApproveError("host does not match");
      }
      // update funding

      await fundingRepo.updateById(funding_id, {
        title: request.title,
        content: request.content,
        thumbnail: request.thumbnail,
        target_value: request.target_value,
        begin_date: request.begin_date,
        end_date: request.end_date,
        content_thumbnails: meta !== undefined
          ? JSON.stringify(meta?.content_thumbnails)
          : undefined,
        updated_at: new Date(),
        funding_request_id: request.id,
      });
      if (meta !== undefined) {
        // process tags
        const included_tag = (await fundingTagRepo.intersectTags(meta.tags))
          .map((
            t,
          ) => t.tag);
        const not_included_tag = meta.tags.filter(
          (t) => !included_tag.includes(t),
        );
        await fundingTagRepo.insert(not_included_tag.map((t) => ({
          tag: t,
        })));
        // add tags and delete tags
        const funding_tags = funding.tags.map((t) => t.tag);
        const added_tags = meta.tags.filter((t) => !funding_tags.includes(t));
        const deleted_tags = funding.tags.filter((t) =>
          !meta.tags.includes(t.tag)
        );

        await fundingRepo.insertTagsByName(funding_id, added_tags);
        await fundingRepo.deleteTags(funding_id, deleted_tags.map((t) => t.id));

        // process rewards
        // add rewards for funding.
        await fundingRepo.insertRewards(
          meta.rewards.filter((r) => r.id === undefined).map((r) => ({
            funding_id: funding.id,
            title: r.title,
            content: r.content,
            price: r.price,
            reward_count: r.reward_count,
          })),
        );
        // update rewards for funding.
        await Promise.all(
          meta.rewards.filter((r): r is { id: number } & typeof r =>
            r.id !== undefined && funding.rewards.some((f) => f.id === r.id)
          ).map((r) =>
            fundingRepo.updateReward(
              r.id,
              {
                title: r.title,
                content: r.content,
                price: r.price,
                reward_count: r.reward_count,
              },
            )
          ),
        );
      }
      result_funding_id = funding_id;
    } else {
      // create new funding
      if (meta === undefined) {
        throw new FundingApproveError("meta does not exist");
      }
      let funding_id: number | undefined;
      try {
        funding_id = await fundingRepo.insert({
          title: request.title,
          content: request.content,
          thumbnail: request.thumbnail,
          target_value: request.target_value,
          begin_date: request.begin_date,
          end_date: request.end_date,
          host_id: request.host_id,
          content_thumbnails: meta.content_thumbnails,
          funding_request_id: request.id,
        });
      } catch (error) {
        if (isDuplKeyError(error)) {
          throw new FundingApproveError("duplicated title");
        }
        throw error;
      }
      if (funding_id === undefined) {
        throw new FundingApproveError("삽입 실패");
      }
      const v = funding_id;
      const included_tag = (await fundingTagRepo.intersectTags(meta.tags)).map((
        t,
      ) => t.tag);
      const not_included_tag = meta.tags.filter(
        (t) => !included_tag.includes(t),
      );
      await fundingTagRepo.insert(not_included_tag.map((t) => ({
        tag: t,
      })));
      await fundingRepo.insertTagsByName(funding_id, meta.tags);
      await fundingRepo.insertRewards(meta.rewards.map((r) => ({
        title: r.title,
        content: r.content,
        price: r.price,
        reward_count: r.reward_count,
        funding_id: v,
      })));

      result_funding_id = funding_id;
    }
    await requestRepo.updateById(request_id, {
      funding_request_id: result_funding_id,
      funding_state: 1,
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
  recipient,
  phone,
}: {
  user_id: number;
  funding_id: number;
  reward_id: number;
  address: string;
  recipient: string;
  phone: string;
}) {
  return await safeTransaction(async (db) => {
    const fundingRepo = new FundingsRepository(db);
    const rewardRepo = new FundingRewardsRepository(db);

    const funding = await fundingRepo.findById(funding_id);
    if (funding === undefined) {
      throw new FundingUsersError("funding does not exist");
    }
    if (funding.deleted_at !== null) {
      throw new FundingUsersError("funding is deleted");
    }
    if (funding.end_date.getTime() < Date.now()) {
      throw new FundingUsersError("funding is ended");
    }

    try {
      await new FundingUsersRepository(db).insert({
        user_id,
        funding_id,
        reward_id,
        address,
        recipient,
        phone,
      });
    } catch (error) {
      if (isDuplKeyError(error)) {
        throw new FundingUsersError("already participated");
      }
      throw error;
    }

    const reward = await rewardRepo.findById(reward_id);
    if (reward === undefined) {
      throw new FundingUsersError("reward does not exist");
    }
    if (reward.reward_current_count >= reward.reward_count) {
      throw new FundingUsersError("reward is full");
    }
    reward.reward_current_count += 1;
    rewardRepo.updateById(reward_id, reward);

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
    const fundingRepo = new FundingsRepository(db);

    const funding = await fundingRepo.findById(funding_id);
    if (funding === undefined) {
      throw new FundingUsersError("funding does not exist");
    }
    if (funding.end_date.getTime() < Date.now()) {
      throw new FundingUsersError("funding is ended");
    }

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

    fundingRepo.addCurrentValue(funding_id, -reward.price);
  });
}

/**
 * Soft-deletes a funding record by its ID and refunds the users.
 *
 * @param {number} funding_id - The ID of the funding record to delete.
 * @return {Promise<void>} A promise that resolves when the funding record is successfully deleted.
 */
export async function deleteFunding({ funding_id }: { funding_id: number }) {
  return await safeTransaction(async (db) => {
    const fundingRepo = new FundingsRepository(db);
    const fundingUserRepo = new FundingUsersRepository(db);
    await fundingRepo.softDelete(funding_id);
    // refunding funding
    await fundingUserRepo.deleteByFundingId(funding_id);
    await fundingRepo.updateById(funding_id, {
      current_value: 0,
    });
  });
}
