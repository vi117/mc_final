import clsx from "clsx";
import { useRef } from "react";
import { Spinner } from "react-bootstrap";
import { AiOutlineFile } from "react-icons/ai";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { UploadState } from "./hook";
import classes from "./upload.module.css";

const imageExt = new Set(["jpg", "jpeg", "png", "gif", "bmp", "webp", "avif"]);

export function Upload({
  state,
  className,
  imgContainerClassName = "",
  imgClassName = "",
  multiple = false,
}: {
  state: UploadState;
  className?: string;
  imgContainerClassName?: string;
  imgClassName?: string;
  multiple?: boolean;
}) {
  const { images, uploading, handleUploadFile, removeImage } = state;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className={clsx(classes["upload_area"], className)}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.items) {
            [...e.dataTransfer.items].forEach((item) => {
              if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) {
                  handleUploadFile(file, multiple);
                }
              }
            });
          } else {
            e.dataTransfer.files;
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onClick={(e) => {
          e.preventDefault();
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        {images.map((image) => {
          const ext = image.split(".").pop();
          return (
            <div
              className={clsx("position-relative", {
                [classes.image_preview]: imgContainerClassName === "",
                [imgContainerClassName]: imgContainerClassName !== "",
              })}
            >
              {ext && imageExt.has(ext)
                ? (
                  <img
                    src={image}
                    className={clsx({
                      [classes["image_preview_image"]]: imgClassName === "",
                      [imgClassName]: imgClassName !== "",
                    })}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(image, "_blank");
                    }}
                  />
                )
                : (
                  <AiOutlineFile
                    className={classes["image_preview_image"]}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(image, "_blank");
                    }}
                  />
                )}
              <IoMdRemoveCircleOutline
                className={classes["image_preview_delete"]}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeImage(image);
                }}
              />
            </div>
          );
        })}
        {(uploading > 0) && (
          <div className={classes["uploading_area"]}>
            <Spinner />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        className={classes["upload_input"]}
        type="file"
        multiple={multiple}
        onChange={saveImage}
      />
    </>
  );

  function saveImage(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      if (multiple) {
        [...e.target.files].forEach((file) => {
          handleUploadFile(file, multiple);
        });
      } else {
        if (e.target.files.length > 0) {
          handleUploadFile(e.target.files[0], multiple);
        }
      }
    }
  }
}

export default Upload;
