import { getDB, isDuplKeyError } from "@/db/util";
import ajv from "@/util/ajv";
import { RouterCatch } from "@/util/util";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import sanitize from "sanitize-html";

import { FundingReportsRepository, FundingsRepository } from "./funding_model";
import { FundingRequestsRepository } from "./request_model";

import upload from "@/file/multer";
import { checkLogin } from "@/users/jwt";
import {
  assert_exists,
  assert_param,
  BadRequestError,
} from "@/util/assert_param";
import {
  parseQueryToNumber,
  parseQueryToString,
  parseQueryToStringList,
} from "@/util/query_param";
import assert from "assert";
import {
  approveFundingRequest,
  deleteFunding,
  FundingApproveError,
  FundingUsersError,
  participateFunding,
  withdrawFunding,
} from "./service";
import { isRewardArray } from "./util";

const router = Router();

/**
 * Retrieves all funding data based on the provided query parameters.
 */
async function getAllFundingHandler(req: Request, res: Response) {
  const fundingRepository = new FundingsRepository(getDB());
  const queryParams = req.query;
  const limit = parseQueryToNumber(queryParams.limit, 50);
  const offset = parseQueryToNumber(queryParams.offset, 0);
  const host_id = parseQueryToNumber(queryParams.host_id);
  const tags = parseQueryToStringList(queryParams.tags);
  const interest = queryParams.interest === "true";
  const participated = queryParams.participated === "true";
  const reviewed = parseQueryToString(queryParams?.reviewed);
  const title = parseQueryToString(queryParams?.title);

  assert_param(
    reviewed === undefined || reviewed === "reviewed"
      || reviewed === "not_reviewed",
    "reviewed must be 'reviewed' or 'not_reviewed'",
  );

  const user = req.user;

  const include_deleted = queryParams.include_deleted === "true"
    && user?.is_admin;

  let begin_date: Date | undefined;
  let end_date: Date | undefined;

  if (typeof queryParams.begin_date === "string") {
    begin_date = new Date(queryParams.begin_date);
  }

  if (user?.is_admin) {
    if (typeof queryParams.end_date === "string") {
      end_date = new Date(queryParams.end_date);
    }
  }

  const cursor: number | undefined = parseQueryToNumber(queryParams.cursor);
  const result = await fundingRepository.findAll({
    limit,
    offset,
    cursor,
    user_id: user?.id,
    begin_date,
    end_date,
    tags,
    host_id,
    include_deleted,
    interest,
    participated,
    reviewed,
    title,
  });
  res.json(result).status(StatusCodes.OK);
}

async function getSingleFundingHandler(req: Request, res: Response) {
  const fundingRepository = new FundingsRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  const user = req.user;
  const result = await fundingRepository.findById(id, {
    user_id: user?.id,
  });
  assert_exists(!!result, "존재하지 않는 펀딩입니다.");
  if (!user?.is_admin && result.begin_date.getTime() >= new Date().getTime()) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "공개 준비 중인 펀딩입니다.",
    });
    return;
  }
  if (result.deleted_at !== null) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "비공개 된 펀딩입니다.",
      code: "DELETED",
    });
  }
  res.json(result).status(result ? StatusCodes.OK : StatusCodes.NOT_FOUND);
}

async function getAllFundingRequestHandler(req: Request, res: Response) {
  const requestRepo = new FundingRequestsRepository(getDB());
  const queryParams = req.query;
  const limit = parseQueryToNumber(queryParams.limit, 50);
  const offset = parseQueryToNumber(queryParams.offset, 0);
  const viewAll = queryParams.view_all === "true";
  const user = req.user;
  assert(user);
  assert_param(
    (!viewAll) || user.is_admin,
    "view_all은 관리자만 조회할 수 있습니다.",
  );
  const result = await requestRepo.findAll({
    limit,
    offset,
    user_id: viewAll ? undefined : user.id,
  });
  res.json(result).status(StatusCodes.OK);
}

async function getSingleFundingRequestHandler(req: Request, res: Response) {
  const requestRepo = new FundingRequestsRepository(getDB());
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  const user = req.user;
  assert(user, "로그인이 필요합니다.");

  const result = await requestRepo.findById(id);
  assert_exists(!!result, "존재하지 않는 펀딩 요청입니다.");

  if (!user?.is_admin && result.host_id !== user.id) {
    res.status(StatusCodes.FORBIDDEN).json({ message: "요청자가 아닙니다." });
    return;
  }
  res.json(result).status(StatusCodes.OK);
}

async function getAllFundingReportsHandler(req: Request, res: Response) {
  const reportRepo = new FundingReportsRepository(getDB());
  const queryParams = req.query;
  const limit = Math.min(parseQueryToNumber(queryParams.limit, 50), 200);
  const offset = parseQueryToNumber(queryParams.offset, 0);

  const result = await reportRepo.findAll({
    limit,
    offset,
  });

  res.json(result).status(StatusCodes.OK);
}

async function getFundingRewardsHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  const fundingRepo = new FundingsRepository(getDB());
  // TODO: date check
  const result = await fundingRepo.getFundingRewards(id);
  res.json(result).status(StatusCodes.OK);
}

async function deleteFundingHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  await deleteFunding({ funding_id: id });
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function interestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  const disset = req.query.disset === "true";

  const user = req.user;
  assert(user);

  const fundingRepo = new FundingsRepository(getDB());
  try {
    if (disset) {
      const d = await fundingRepo.unsetInterest(id, user.id);
      if (d.numDeletedRows === 0n) {
        res.status(StatusCodes.CONFLICT).json({
          message: "이미 관심펀딩이 아닙니다.",
        });
        return;
      }
    } else {
      await fundingRepo.setInterest(id, user.id);
    }
  } catch (error) {
    if (isDuplKeyError(error)) {
      res.status(StatusCodes.CONFLICT).json({
        message: "이미 관심 펀딩입니다.",
      });
      return;
    } else {
      throw error;
    }
  }
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function participateFundingHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const req_id = parseInt(req.params.req_id);
  assert(!isNaN(req_id));

  const v = ajv.validate({
    type: "object",
    properties: {
      address: { type: "string" },
      recipient: { type: "string" },
      phone: { type: "string" },
    },
    required: ["address"],
  }, req.body);
  assert_param(v, "유효하지 않은 요청입니다.", {
    errors: ajv.errors,
  });

  const { address, recipient, phone } = req.body;

  const user = req.user;
  assert(user);
  try {
    await participateFunding({
      user_id: user.id,
      funding_id: id,
      reward_id: req_id,
      address: address,
      recipient: recipient,
      phone: phone,
    });
  } catch (error) {
    if (error instanceof FundingUsersError) {
      res.status(StatusCodes.CONFLICT).json({ message: error.message });
      return;
    } else {
      throw error;
    }
  }
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function withdrawFundingHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user = req.user;
  assert(user);
  const req_id = parseInt(req.params.req_id);
  assert(!isNaN(req_id));

  try {
    await withdrawFunding({
      user_id: user.id,
      funding_id: id,
      reward_id: req_id,
    });
  } catch (error) {
    if (error instanceof FundingUsersError) {
      res.status(StatusCodes.CONFLICT).json({ message: error.message });
      return;
    } else {
      throw error;
    }
  }
  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function reportFundingHandler(req: Request, res: Response) {
  const getUrlFromFiles = () => {
    const files = req.files;
    if (!files) {
      return undefined;
    }
    assert(!(files instanceof Array));
    const p = files["attachment"];
    if (!p) {
      return undefined;
    }
    return p.map((f) => f.url);
  };
  const urls = getUrlFromFiles();

  const id = parseInt(req.params.id);
  assert(!isNaN(id));
  const user = req.user;
  assert(user);

  const v = ajv.validate({
    type: "object",
    properties: {
      content: { type: "string" },
    },
    required: ["content"],
  }, req.body);
  assert_param(v, "유효하지 않은 요청입니다.", {
    errors: ajv.errors,
  });

  const fundingReportsRepo = new FundingReportsRepository(getDB());
  await fundingReportsRepo.insert({
    user_id: user.id,
    funding_id: id,
    content: req.body.content,
    meta_parsed: urls,
  });

  res.json({ message: "success" }).status(StatusCodes.OK);
}

async function createFundingRequestHandler(req: Request, res: Response) {
  const files = req.files;
  if (!files) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "파일이 필요합니다.",
    });
    return;
  }
  assert(!(files instanceof Array));
  const thumbnailArr = files["thumbnail"];
  assert_param(thumbnailArr && thumbnailArr.length > 0, "썸네일이 필요합니다.");
  const thumbnail = thumbnailArr[0].url;

  if (!("content_thumbnail" in files)) {
    // set default thumbnail
    files["content_thumbnail"] = [thumbnailArr[0]];
  }
  const content_thumbnails = files["content_thumbnail"].map((file) => file.url);
  if (!("certificate" in files)) {
    files["certificate"] = [];
  }
  const certificate = files["certificate"].map((file) => file.url);

  const requestRepo = new FundingRequestsRepository(getDB());
  const user = req.user;
  assert(user, "로그인이 필요합니다.");
  const v = ajv.validate({
    type: "object",
    properties: {
      title: { type: "string" },
      content: { type: "string" },
      begin_date: { type: "string", format: "date-time" },
      end_date: { type: "string", format: "date-time" },
      target_value: { type: "string" },
      rewards: { type: "string" },
      tags: { type: "string" },
      funding_id: { type: "string" },
      account_number: { type: "string" },
    },
    required: [
      "title",
      "content",
      "begin_date",
      "end_date",
      "target_value",
      "rewards",
    ],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }

  let rewards;
  try {
    rewards = JSON.parse(req.body.rewards);
  } catch (error) {
    throw new BadRequestError("보상이 유효하지 않습니다.", {
      errors: { rewards: "JSON syntax error", param: req.body.rewards },
    });
  }
  if (!isRewardArray(rewards)) {
    throw new BadRequestError("보상이 유효하지 않습니다.", {
      errors: ajv.errors,
    });
  }
  if (rewards.length === 0) {
    throw new BadRequestError("보상이 없습니다.");
  }
  const target_value = parseInt(req.body.target_value);
  assert_param(!isNaN(target_value), "타겟 값이 유효하지 않습니다.");
  const funding_id_str = req.body.funding_id;
  let funding_id = undefined;
  if (funding_id_str) {
    funding_id = parseInt(funding_id_str);
    assert_param(!isNaN(funding_id), "funding_id가 유효하지 않습니다.");
  }

  const tags = req.body.tags.split(",");

  const { title, content, begin_date, end_date, account_number } = req.body;

  try {
    const clean_content = sanitize(content, {
      allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
    });
    const insertedId = await requestRepo.insert({
      host_id: user.id,
      title,
      content: clean_content,
      begin_date: new Date(begin_date),
      end_date: new Date(end_date),
      target_value,
      thumbnail,
      funding_request_id: funding_id,
      meta_parsed: ({
        tags: tags,
        rewards: rewards,
        content_thumbnails: content_thumbnails,
        account_number: account_number,
        certificate: certificate,
      }),
    });
    res
      .status(StatusCodes.CREATED)
      .json({
        message: "success",
        id: insertedId,
      });
  } catch (error) {
    if (isDuplKeyError(error)) {
      res.status(StatusCodes.CONFLICT).json({
        message: "이미 존재하는 제목입니다.",
      });
      return;
    }
    throw error;
  }
}
async function approveFundingRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  try {
    await approveFundingRequest(id);
  } catch (error) {
    if (error instanceof FundingApproveError) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      return;
    }
    throw error;
  }
  res.status(StatusCodes.OK).json({ message: "승인되었습니다." });
}

async function disapproveFundingRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  assert(!isNaN(id));

  const v = ajv.validate({
    type: "object",
    properties: {
      reason: { type: "string" },
    },
    required: ["reason"],
  }, req.body);

  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }

  const requestRepo = new FundingRequestsRepository(getDB());
  requestRepo.updateById(id, {
    funding_state: 2,
    reason: req.body.reason,
    deleted_at: new Date(),
  });

  res.status(StatusCodes.OK).json({ message: "거절되었습니다." });
}

router.get("/", RouterCatch(getAllFundingHandler));
router.get("/:id(\\d+)", RouterCatch(getSingleFundingHandler));
router.get(
  ":id(\\d+)/rewards",
  checkLogin(),
  RouterCatch(getFundingRewardsHandler),
);

router.get(
  "/request/",
  checkLogin(),
  RouterCatch(getAllFundingRequestHandler),
);
router.get(
  "/request/:id(\\d+)",
  checkLogin(),
  RouterCatch(getSingleFundingRequestHandler),
);

router.get(
  "/reports",
  checkLogin({ admin_check: true }),
  RouterCatch(getAllFundingReportsHandler),
);

router.delete(
  "/:id(\\d+)",
  checkLogin({ admin_check: true }),
  RouterCatch(deleteFundingHandler),
);

router.post("/:id(\\d+)/interest", checkLogin(), RouterCatch(interestHandler));
router.post(
  "/:id(\\d+)/rewards/:req_id(\\d+)/participate",
  checkLogin(),
  RouterCatch(participateFundingHandler),
);
router.post(
  "/:id(\\d+)/rewards/:req_id(\\d+)/withdraw",
  checkLogin(),
  RouterCatch(withdrawFundingHandler),
);
router.post(
  "/:id(\\d+)/report",
  checkLogin(),
  upload.fields([
    { name: "attachment", maxCount: 5 },
  ]),
  RouterCatch(reportFundingHandler),
);

router.post(
  "/request/",
  checkLogin(),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "content_thumbnail", maxCount: 5 },
    { name: "certificate", maxCount: 5 },
  ]),
  RouterCatch(createFundingRequestHandler),
);
router.post(
  "/request/:id(\\d+)/approve",
  checkLogin({ admin_check: true }),
  RouterCatch(approveFundingRequestHandler),
);
router.post(
  "/request/:id(\\d+)/reject",
  checkLogin({ admin_check: true }),
  RouterCatch(disapproveFundingRequestHandler),
);

export default router;
