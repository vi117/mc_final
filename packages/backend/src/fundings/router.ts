// import ajv from "@/util/ajv";
import { RouterCatch } from "@/util/util";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get(
  "/",
  RouterCatch((req: Request, res: Response) => {
    res.json({ message: "hello" }).status(StatusCodes.OK);
  }),
);

export default router;
