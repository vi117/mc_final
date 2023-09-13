// import ajv from "@/util/ajv";
import { getDB } from "@/db/util";
import { RouterCatch } from "@/util/util";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { FundingsRepository } from "./funding_model";

const router = Router();

async function AllFundingHandler(req: Request, res: Response) {
  const fundingRepository = new FundingsRepository(getDB());
  const queryParams = req.query;
  const limit = parseInt(typeof queryParams.limit === "string" ? queryParams.limit : "50");
  const offset = parseInt(typeof queryParams.offset === "string" ? queryParams.offset : "0");
  const user = req.user;

  let cursor: number | undefined = parseInt(
    typeof queryParams.cursor === "string" ? queryParams.cursor : "NaN",
  );
  cursor = isNaN(cursor) ? undefined : cursor;
  const result = await fundingRepository.findAll({
    limit,
    offset,
    cursor,
    user_id: user?.id,
  });
  res.json(result).status(StatusCodes.OK);
}

async function SingleFundingHandler(req: Request, res: Response) {
  const fundingRepository = new FundingsRepository(getDB());
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 요청입니다. id 값이 올바르지 않습니다." });
    return;
  }
  const user = req.user;
  const result = await fundingRepository.findById(id, {
    user_id: user?.id,
  });
  res.json(result ?? null).status(StatusCodes.OK);
}

router.get("/", RouterCatch(AllFundingHandler));
router.get("/:id", RouterCatch(SingleFundingHandler));

export default router;
