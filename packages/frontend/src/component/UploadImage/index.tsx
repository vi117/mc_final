import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import classes from "./Upload.module.css";

const Upload = () => {
  const [image, setImage] = useState({
    image_file: "",
    preview_URL: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const saveImage = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      URL.revokeObjectURL(image.preview_URL);
      const preview_URL = URL.createObjectURL(e.target.files[0]);
      setImage(() => (
        {
          image_file: e.target.files[0],
          preview_URL: preview_URL,
        }
      ));
    }
  };

  const deleteImage = () => {
    URL.revokeObjectURL(image.preview_URL);
    setImage({
      image_file: "",
      preview_URL: "",
    });
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(image.preview_URL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const sendImageToServer = () => {
  //   if (image.image_file) {
  //     const formData = new FormData();
  //     formData.append("file", image.image_file);
  //     alert("서버에 등록이 완료되었습니다!");
  //     setImage({
  //       image_file: "",
  //     });
  //   } else {
  //     alert("사진을 등록하세요!");
  //   }
  // };

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
