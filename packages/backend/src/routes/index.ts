import userRouter from "@/users/router";
import { Router } from "express";

const router = Router();

router.use("/api/users", userRouter);

router.get("/", (_req, res) => {
  res.json({ message: "hello" });
});

export default router;
