import articleRouter from "@/article/router";
import fundingRouter from "@/fundings/router";
import UploadRouter from "@/upload/upload";
import { tokenCheckMiddleware } from "@/users/jwt";
import userRouter from "@/users/router";
import { Router } from "express";

const router = Router();

router.use("/", tokenCheckMiddleware);
router.use("/api/users", userRouter);
router.use("/api/fundings", fundingRouter);
router.use("/api/articles", articleRouter);
router.use("/api/upload", UploadRouter);

router.all("/api", (req, res) => {
  res.json({
    message: "hello. it's api base",
    body: req.body,
    query: req.query,
  }).status(200);
});

export default router;
