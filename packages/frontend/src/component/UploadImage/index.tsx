import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import classes from "./Upload.module.css";

const Upload = ({
  imageFile,
}: {
  imageFile: React.MutableRefObject<File | null>;
}) => {
  const [image, setImage] = useState<{
    image_file: File | null;
    preview_URL: string;
  }>({
    image_file: null,
    preview_URL: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const saveImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      URL.revokeObjectURL(image.preview_URL);
      const preview_URL = URL.createObjectURL(e.target.files[0]);
      imageFile.current = e.target.files[0];
      setImage(
        {
          image_file: e.target.files[0],
          preview_URL: preview_URL,
        },
      );
    }
  };

  const deleteImage = () => {
    URL.revokeObjectURL(image.preview_URL);
    imageFile.current = null;
    setImage({
      image_file: null,
      preview_URL: "",
    });
  };

  useEffect(() => {
    return () => {
      if (image.preview_URL !== "") {
        imageFile.current = null;
        URL.revokeObjectURL(image.preview_URL);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes["uploader-wrapper"]}>
      <input
        type="file"
        accept="image/*"
        onChange={saveImage}
        ref={inputRef}
        style={{ display: "none" }}
      >
      </input>
      <div className={classes["img-wrapper"]}>
        <img
          className={classes["imgSize"]}
          src={image.preview_URL}
          onClick={() => inputRef.current?.click()}
        />
        {image.preview_URL === "" && (
          <AiOutlineCloudUpload
            className={classes["icon"]}
            onClick={() => inputRef.current?.click()}
          />
        )}
      </div>

      <div className={classes["upload-button"]}>
        <Button variant="danger" onClick={deleteImage}>
          <AiOutlineDelete />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default Upload;
