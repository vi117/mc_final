import { getMockDB } from "@/db/mockDB";
import { FundingRequestsRepository } from "./request_model";

describe("FundingRequestsRepository", () => {
  it("findAll", async () => {
    const [mock_db, result] = await getMockDB();
    const repo = new FundingRequestsRepository(mock_db);
    expect(repo.findAll).toBeDefined();
    await repo.findAll({});
    expect(result.length).toEqual(1);
  });
});
