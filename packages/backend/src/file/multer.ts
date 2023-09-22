import crypto from "crypto";
import debug_fn from "debug";
import Multer from "multer";
import path from "path";
import { MinioEngine } from "./minioEngine";

const debug = debug_fn("joinify:multer");

function createMinioMulter() {
  return Multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    storage: new MinioEngine({
      region: process.env.S3_REGION,
      accessKey: process.env.S3_ACCESS_KEY ?? "",
      secretKey: process.env.S3_SECRET_KEY ?? "",
      endPoint: process.env.S3_ENDPOINT ?? "",
      useSSL: process.env.S3_USE_SSL === "true",
      bucket: process.env.S3_BUCKET ?? "",
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = crypto.randomUUID();

        cb(null, basename + ext);
      },
    }),
  });
}

function createLocalMemoryMulter() {
  return Multer({
    storage: Multer.memoryStorage(),
  });
}
function createLocalStorageMulter() {
  const storageEngine = Multer.diskStorage({
    destination: "dist",
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = crypto.randomUUID();

      cb(null, basename + ext);
    },
  });
  const oldHandleFile = storageEngine._handleFile;
  storageEngine._handleFile = (req, file, cb) => {
    file.url = req.protocol + "://" + req.get("host") + "/dist/"
      + file.filename;
    oldHandleFile(req, file, cb);
  };
  return Multer(
    {
      dest: "dist",
      storage: storageEngine,
    },
  );
}
function createMulter() {
  const storageType = process.env.STORAGE_TYPE;
  if (storageType === "minio") {
    debug("minio 업로드");
    return createMinioMulter();
  } else if (storageType === "local") {
    debug("local 업로드");
    return createLocalStorageMulter();
  }
  debug("local memory 업로드");
  return createLocalMemoryMulter();
}

const upload = createMulter();

export default upload;
