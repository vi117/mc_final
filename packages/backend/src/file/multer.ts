import crypto from "crypto";
import Multer from "multer";
import path from "path";

const upload = Multer(
  {
    dest: "public",
    storage: Multer.diskStorage({
      destination: "public",
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = crypto.randomUUID();

        cb(null, basename + ext);
      },
    }),
  },
);

export default upload;
