import assert from "assert";
import { approveFundingRequest, FundingApproveError } from "./service";

// eslint-disable-next-line no-var
var findByIdMock = jest.fn();
// eslint-disable-next-line no-var
var updateByIdMock = jest.fn();
// eslint-disable-next-line no-var
var insertMock = jest.fn();
// eslint-disable-next-line no-var
var insertRewards = jest.fn();
// eslint-disable-next-line no-var
var insertTagsByName = jest.fn();

jest.mock("./request_model", () => {
  return {
    FundingRequestsRepository: jest.fn().mockImplementation(() => {
      return {
        findById: findByIdMock,
        updateById: updateByIdMock,
      };
    }),
  };
});
jest.mock("./funding_model", () => ({
  FundingsRepository: jest.fn().mockImplementation(() => ({
    insert: insertMock,
    insertTagsByName,
    insertRewards,
  })),
}));

beforeEach(() => {
  findByIdMock.mockReset();
  updateByIdMock.mockReset();
  insertMock.mockReset();
  insertRewards.mockReset();
  insertTagsByName.mockReset();
});

describe("approveFundingRequest", () => {
  const request_template = {
    title: "Request Title",
    content: "Request Content",
    thumbnail: "Request Thumbnail",
    target_value: 1000,
    begin_date: new Date(),
    end_date: new Date(),
    host_id: 789,
    funding_status: 0,
  };

  it("should throw an error if the request is not found", async () => {
    const request_id = 123;
    findByIdMock.mockResolvedValue(undefined);

    try {
      await approveFundingRequest(request_id);
    } catch (error) {
      expect(error).toBeInstanceOf(FundingApproveError);
      assert(error instanceof FundingApproveError);
      expect(error.message).toBe("존재하지 않는 요청 ID");
      expect(findByIdMock).toHaveBeenCalledWith(request_id);
    }
  });

  it("should update an existing funding request", async () => {
    const request_id = 123;
    const request = {
      ...request_template,
      funding_request_id: 456,
    };
    findByIdMock.mockResolvedValue(request);

    await approveFundingRequest(request_id);

    expect(findByIdMock).toHaveBeenCalledWith(request_id);
    expect(updateByIdMock).toHaveBeenCalledWith(request_id, {
      title: request.title,
      content: request.content,
      thumbnail: request.thumbnail,
      target_value: request.target_value,
      end_date: request.end_date,
      host_id: request.host_id,
    });
  });

  it("should insert a new funding request", async () => {
    const request_id = 123;
    const funding_id = 456;
    const meta_parsed = {
      tags: ["tag1", "tag2"],
      rewards: [
        {
          title: "title",
          content: "content",
          price: 1000,
          reward_count: 1,
        },
      ],
    };
    const request = {
      ...request_template,
      meta_parsed: meta_parsed,
      meta: JSON.stringify(meta_parsed),
    };

    findByIdMock.mockResolvedValue(request);
    insertMock.mockResolvedValue(funding_id);

    await approveFundingRequest(request_id);

    expect(findByIdMock).toHaveBeenCalledWith(request_id);
    expect(insertMock).toHaveBeenCalledWith({
      title: request.title,
      content: request.content,
      thumbnail: request.thumbnail,
      target_value: request.target_value,
      begin_date: request.begin_date,
      end_date: request.end_date,
      host_id: request.host_id,
    });
    expect(updateByIdMock).toHaveBeenCalledWith(request_id, {
      funding_request_id: funding_id,
    });
  });

  it("should throw an error if the funding insert fails", async () => {
    const request_id = 123;
    const request = request_template;

    findByIdMock.mockResolvedValue(request);
    insertMock.mockResolvedValue(undefined);

    try {
      await approveFundingRequest(request_id);
    } catch (error) {
      expect(error).toBeInstanceOf(FundingApproveError);
      assert(error instanceof FundingApproveError);
      expect(error.message).toBe("삽입 실패");
      expect(findByIdMock).toHaveBeenCalledWith(request_id);
      expect(insertMock).toHaveBeenCalledWith({
        title: request.title,
        content: request.content,
        thumbnail: request.thumbnail,
        target_value: request.target_value,
        begin_date: request.begin_date,
        end_date: request.end_date,
        host_id: request.host_id,
      });
    }
  });
});
