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
  });
});
