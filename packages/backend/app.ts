import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";

import { testDBConnection } from "@/db/util";

import { HandlerErrorBase } from "@/util/assert_param";
import indexRouter from "./src/routes/index";

const app = express();

testDBConnection();

// disable etag
app.set("etag", false);

app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env["SERVER_URL"] ?? "http://localhost:3000",
  ],
  credentials: true,
}));

app.use(logger("dev"));
app.use(express.static("public"));
app.use("/api/dist", express.static("dist"));
app.use(express.json());
app.use(express.urlencoded(
  {
    // we use qs lib instead of querystring.
    // querystring is deprecated
    extended: true,
  },
));

app.use(cookieParser());

app.use("/", indexRouter);

app.use((req, res, _next) => {
  res.status(404)
    .json({
      message: "404 error. API 존재하지 않음.",
      url: req.url,
    });
});

// error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HandlerErrorBase) {
    res.status(err.status).json({ message: err.message, ...err.options });
    return;
  }
  console.error("500 error", err);
  res.status(500)
    .json({ message: "error" });
});

export default app;
