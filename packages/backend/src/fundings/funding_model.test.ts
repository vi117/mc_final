import { getMockDB } from "@/db/mockDB";
import { FundingsRepository } from "./funding_model";

describe("FundingModel", () => {
  it("FundingsRepository", () => {
    expect(FundingsRepository).toBeDefined();
  });

  it("findAll", async () => {
    const [mock_db, result] = await getMockDB();
    const repo = new FundingsRepository(mock_db);
    expect(repo.findAll).toBeDefined();
    await repo.findAll();
    expect(result.length).toEqual(1);
    expect(result[0].sql).toEqual([
      "select `fundings`.*, `host`.`nickname` as `host_nickname`,",
      " `host`.`profile_image` as `host_profile_image`,",
      " `host`.`email` as `host_email`,",
      " `interest`.`funding_id` as `interest_funding_id`,",
      " (select cast(coalesce(json_arrayagg(json_object('tag', `agg`.`tag`)), '[]') as json) ",
      "from (select `funding_tags`.`tag` as `tag` from `funding_tag_rel` ",
      "inner join `funding_tags` on `funding_tag_rel`.`tag_id` = `funding_tags`.`id` ",
      "where `funding_tag_rel`.`funding_id` = `fundings`.`id`) as agg) as `tags` ",
      "from `fundings` inner join `users` as `host` on `fundings`.`host_id` = `host`.`id`",
      " left join `user_funding_interest` as `interest` on `interest`.`funding_id` = `fundings`.`id`",
      " and `interest`.`user_id` = ? limit ? offset ?",
    ].join(""));
  });
});
