import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Client, ClientOptions } from "minio";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";
import "./multer_file";

export interface MinioEngineOptions extends ClientOptions {
  bucket: string;
  filename?: (
    req: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    file: Express.Multer.File,
    callback: (
      error?: unknown,
      filename?: string | undefined,
    ) => void,
  ) => void;
}

export class MinioEngine implements StorageEngine {
  s3: Client;
  bucket: string;
  endPoint: string;
  useSSL: boolean;
  filename: (
    req: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    file: Express.Multer.File,
    callback: (
      error?: unknown,
      filename?: string | undefined,
    ) => void,
  ) => void;

  constructor(options: MinioEngineOptions) {
    this.s3 = new Client(options);
    this.bucket = options.bucket;
    this.endPoint = options.endPoint;
    this.useSSL = options.useSSL ?? false;
    this.filename = options.filename ?? ((_req, file, callback) => {
      callback(null, file.originalname);
    });
  }
  _handleFile(
    _req: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    file: Express.Multer.File,
    callback: (
      error?: unknown,
      info?: Partial<Express.Multer.File> | undefined,
    ) => void,
  ): void {
    this.filename(_req, file, (error, filename) => {
      if (error) {
        return callback(error);
      }
      if (!filename) {
        return callback(new Error("unknown error"));
      }
      this.s3.putObject(
        this.bucket,
        filename,
        file.stream,
        {
          "Content-Type": file.mimetype,
        },
      ).then((_v) => {
        callback(null, {
          filename: filename,
          mimetype: file.mimetype,
          url: `${
            this.useSSL ? "https" : "http"
          }://${this.endPoint}/${this.bucket}/${filename}`,
          size: file.size,
        });
      }).catch((e) => {
        callback(e);
      });
    });
  }
  _removeFile(
    req: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): void {
    this.s3.removeObject(this.bucket, file.filename).then(() => {
      callback(null);
    }).catch((e) => {
      callback(e);
    });
  }
}
