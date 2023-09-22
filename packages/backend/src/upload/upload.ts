import upload from "@/file/multer";
import { Router } from "express";

const router = Router();

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "파일이 없습니다." });
    return;
  }
  if (!req.user) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }
  res.status(200).json({ url: req.file?.url });
});

export default router;
