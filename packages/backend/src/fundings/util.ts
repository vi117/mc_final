import ajv from "@/util/ajv";
import { FundingRewardInput } from "./request_model";

export function isReward(o: unknown): o is FundingRewardInput {
  ajv.validate({
    properties: {
      "title": { type: "string" },
      "content": { type: "string" },
      "price": { type: "number" },
      "reward_count": { type: "number" },
    },
  }, o);
  return true;
}

export function isRewardArray(o: unknown): o is FundingRewardInput[] {
  ajv.validate({
    type: "array",
    items: {
      properties: {
        "title": { type: "string" },
        "content": { type: "string" },
        "price": { type: "number" },
        "reward_count": { type: "number" },
      },
    },
  }, o);
  return true;
}
