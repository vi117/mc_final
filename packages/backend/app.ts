import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";

import { testDBConnection } from "@/db/util";

import indexRouter from "./src/routes/index";

const app = express();

testDBConnection();

// disable etag
app.set("etag", false);

app.use((req, res, next) => {
  // TODO: add cors
  res.set("access-control-allow-origin", "*");
  res.set("access-control-allow-methods", "*");
  res.set("access-control-allow-headers", "content-type, authorization, *");
  res.set("access-control-credentials", "true");

  next();
});

app.use(logger("dev"));
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
  console.error("500 error", err);
  res.status(500)
    .json({ message: "error" });
});

export default app;
