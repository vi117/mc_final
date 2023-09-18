import { getDB, isDuplKeyError } from "@/db/util";
import ajv from "@/util/ajv";
import { RouterCatch } from "@/util/util";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import { FundingsRepository } from "./funding_model";
import { FundingRequestsRepository } from "./request_model";

import upload from "@/file/multer";
import { checkLogin } from "@/users/jwt";
import { parseQueryToNumber, parseQueryToStringList } from "@/util/query_param";
import assert from "assert";
import {
  approveFundingRequest,
  FundingApproveError,
  FundingUsersError,
  participateFunding,
  withdrawFunding,
} from "./service";

const router = Router();

/**
 * Retrieves all funding data based on the provided query parameters.
 */
async function getAllFundingHandler(req: Request, res: Response) {
  const fundingRepository = new FundingsRepository(getDB());
  const queryParams = req.query;
  const limit = parseQueryToNumber(queryParams.limit, 50);
  const offset = parseQueryToNumber(queryParams.offset, 0);

  const tags = parseQueryToStringList(queryParams.tags);

  const user = req.user;

  let begin_date: Date | undefined;
  let end_date: Date | undefined;

  if (user?.is_admin) {
    if (typeof queryParams.begin_date === "string") {
      begin_date = new Date(queryParams.begin_date);
    }
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
  if (!result) {
    res.status(StatusCodes.NOT_FOUND).json();
    return;
  }
  if (!user?.is_admin && result.begin_date.getTime() >= new Date().getTime()) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "공개 준비 중인 펀딩입니다.",
    });
    return;
  }
  res.json(result).status(result ? StatusCodes.OK : StatusCodes.NOT_FOUND);
}

async function getAllFundingRequestHandler(req: Request, res: Response) {
  const requestRepo = new FundingRequestsRepository(getDB());
  const queryParams = req.query;
  const limit = parseQueryToNumber(queryParams.limit, 50);
  const offset = parseQueryToNumber(queryParams.offset, 0);

  const result = await requestRepo.findAll({
    limit,
    offset,
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
  if (!result) {
    res.status(StatusCodes.NOT_FOUND).json();
    return;
  }
  if (!user?.is_admin && result.host_id !== user.id) {
    res.status(StatusCodes.FORBIDDEN).json({ message: "요청자가 아닙니다." });
    return;
  }
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

  const fundingRepo = new FundingsRepository(getDB());
  await fundingRepo.softDelete(id);
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
    },
    required: ["address"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }
  const { address } = req.body;

  const user = req.user;
  assert(user);
  try {
    await participateFunding({
      user_id: user.id,
      funding_id: id,
      reward_id: req_id,
      address: address,
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

async function createFundingRequestHandler(req: Request, res: Response) {
  const thumbnail = req.file?.filename;
  if (!thumbnail) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "썸네일이 필요합니다.",
    });
    return;
  }
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
      target_value: { type: "number" },
      thumbnail: { type: "string" },
    },
    required: [
      "title",
      "content",
      "begin_date",
      "end_date",
      "target_value",
      "thumbnail",
    ],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "유효하지 않은 요청입니다.",
      errors: ajv.errors,
    });
    return;
  }
  const { title, content, begin_date, end_date, target_value } = req.body;
  const insertedId = await requestRepo.insert({
    host_id: user.id,
    title,
    content,
    begin_date: new Date(begin_date),
    end_date: new Date(end_date),
    target_value,
    thumbnail,
  });
  res.json({
    message: "success",
    id: insertedId,
  }).status(StatusCodes.OK);
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

  const requestRepo = new FundingRequestsRepository(getDB());
  requestRepo.updateById(id, {
    funding_state: 2,
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
  checkLogin({ admin_check: true }),
  RouterCatch(getAllFundingRequestHandler),
);
router.get(
  "/request/:id(\\d+)",
  checkLogin(),
  RouterCatch(getSingleFundingRequestHandler),
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
  "/request/",
  checkLogin(),
  upload.single("thumbnail"),
  RouterCatch(createFundingRequestHandler),
);
router.post(
  "/request/:id(\\d+)/approve",
  checkLogin({ admin_check: true }),
  RouterCatch(approveFundingRequestHandler),
);
router.post(
  "/request/:id(\\d+)/disapprove",
  checkLogin({ admin_check: true }),
  RouterCatch(disapproveFundingRequestHandler),
);

export default router;
