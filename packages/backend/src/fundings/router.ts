import { getDB } from "@/db/util";
import ajv from "@/util/ajv";
import { RouterCatch } from "@/util/util";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import { FundingsRepository } from "./funding_model";
import { FundingRequestsRepository } from "./request_model";

import { checkLogin } from "@/users/jwt";
import assert from "assert";
import debug_fn from "debug";
import { approveFundingRequest, FundingApproveError } from "./service";

const debug = debug_fn("joinify:fundings");
const router = Router();

async function getAllFundingHandler(req: Request, res: Response) {
  const fundingRepository = new FundingsRepository(getDB());
  const queryParams = req.query;
  const limit = parseInt(typeof queryParams.limit === "string" ? queryParams.limit : "50");
  const offset = parseInt(typeof queryParams.offset === "string" ? queryParams.offset : "0");
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

  let cursor: number | undefined = parseInt(
    typeof queryParams.cursor === "string" ? queryParams.cursor : "NaN",
  );
  cursor = isNaN(cursor) ? undefined : cursor;
  const result = await fundingRepository.findAll({
    limit,
    offset,
    cursor,
    user_id: user?.id,
    begin_date,
    end_date,
  });
  res.json(result).status(StatusCodes.OK);
}

async function getSingleFundingHandler(req: Request, res: Response) {
  const fundingRepository = new FundingsRepository(getDB());
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    // It's unreachable. if it happens, it's a bug.
    // when it happens, first check the route path.
    debug("unreachable!!! id is NaN");
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다. id 값이 올바르지 않습니다." });
    return;
  }
  const user = req.user;
  const result = await fundingRepository.findById(id, {
    user_id: user?.id,
  });
  if (!result) {
    res.status(StatusCodes.NOT_FOUND).json();
    return;
  }
  if (!user?.is_admin && result.begin_date.getTime() >= new Date().getTime()) {
    res.status(StatusCodes.FORBIDDEN).json({ message: "공개 준비 중인 펀딩입니다." });
    return;
  }
  res.json(result).status(result ? StatusCodes.OK : StatusCodes.NOT_FOUND);
}

async function getAllFundingRequestHandler(req: Request, res: Response) {
  const requestRepo = new FundingRequestsRepository(getDB());
  const queryParams = req.query;
  const limit = parseInt(typeof queryParams.limit === "string" ? queryParams.limit : "50");
  const offset = parseInt(typeof queryParams.offset === "string" ? queryParams.offset : "0");

  const result = await requestRepo.findAll({
    limit,
    offset,
  });
  res.json(result).status(StatusCodes.OK);
}

async function getSingleFundingRequestHandler(req: Request, res: Response) {
  const requestRepo = new FundingRequestsRepository(getDB());
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    debug("unreachable!!! id is NaN");
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다. id 값이 올바르지 않습니다." });
    return;
  }
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

async function createFundingRequestHandler(req: Request, res: Response) {
  const requestRepo = new FundingRequestsRepository(getDB());
  const user = req.user;
  assert(user, "로그인이 필요합니다.");
  const v = ajv.validate({
    type: "object",
    properties: {
      title: { type: "string" },
      content: { type: "string" },
      begin_date: { type: "string" },
      end_date: { type: "string" },
      target_value: { type: "number" },
      thumbnail: { type: "string" },
    },
    required: ["title", "content", "begin_date", "end_date", "target_value", "thumbnail"],
  }, req.body);
  if (!v) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다.", errors: ajv.errors });
    return;
  }
  const { title, content, begin_date, end_date, target_value, thumbnail } = req.body;
  const result = await requestRepo.insert({
    host_id: user.id,
    title,
    content,
    begin_date,
    end_date,
    target_value,
    thumbnail,
  });
  res.json(result).status(StatusCodes.OK);
}
async function approveFundingRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    debug("unreachable!!! id is NaN");
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다. id 값이 올바르지 않습니다." });
    return;
  }
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
  if (isNaN(id)) {
    debug("unreachable!!! id is NaN");
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다. id 값이 올바르지 않습니다." });
    return;
  }
  const requestRepo = new FundingRequestsRepository(getDB());
  requestRepo.updateById(id, {
    funding_state: 3,
  });
}

router.get("/", RouterCatch(getAllFundingHandler));
router.get("/:id(\\d+)", RouterCatch(getSingleFundingHandler));
router.get("/request/", checkLogin({ admin_check: true }), RouterCatch(getAllFundingRequestHandler));
router.get("/request/:id(\\d+)", checkLogin(), RouterCatch(getSingleFundingRequestHandler));
router.post("/request/", checkLogin(), RouterCatch(createFundingRequestHandler));
router.post("/request/:id(\\d+)/approve", checkLogin({ admin_check: true }), RouterCatch(approveFundingRequestHandler));
router.post(
  "/request/:id(\\d+)/disapprove",
  checkLogin({ admin_check: true }),
  RouterCatch(disapproveFundingRequestHandler),
);

export default router;
