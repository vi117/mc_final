import ajv from "@/util/ajv";
import { FundingRewardInput } from "./request_model";

export const RewardSchema = {
  properties: {
    "id": { type: "number" },
    "title": { type: "string" },
    "content": { type: "string" },
    "price": { type: "number" },
    "reward_count": { type: "number" },
  },
  required: ["title", "content", "price", "reward_count"],
};

export function isReward(o: unknown): o is FundingRewardInput {
  ajv.validate(RewardSchema, o);
  return true;
}

export function isRewardArray(o: unknown): o is FundingRewardInput[] {
  ajv.validate({
    type: "array",
    items: RewardSchema,
  }, o);
  return true;
}
