import fundingRouter from "@/fundings/router";
import { tokenCheckMiddleware } from "@/users/jwt";
import userRouter from "@/users/router";
import { Router } from "express";

const router = Router();

router.use("/", tokenCheckMiddleware);
router.use("/api/users", userRouter);
router.use("/api/fundings", fundingRouter);

router.get("/", (_req, res) => {
  res.json({ message: "hello" });
});

export default router;
