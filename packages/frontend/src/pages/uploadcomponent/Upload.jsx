import { useEffect, useState } from "react";
import "./Upload.css";
import { Button } from "@mui/material";

const Upload = () => {
  const [image, setImage] = useState({
    image_file: "",
  });

  let inputRef;

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
    });
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(image.preview_URL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendImageToServer = () => {
    if (image.image_file) {
      const formData = new FormData();
      formData.append("file", image.image_file);
      alert("서버에 등록이 완료되었습니다!");
      setImage({
        image_file: "",
      });
    } else {
      alert("사진을 등록하세요!");
    }
  };

  return (
    <div className="uploader-wrapper">
      <input
        type="file"
        accept="image/*"
        onChange={saveImage}
        onClick={(e) => e.target.value = null}
        ref={refParam => inputRef = refParam}
        style={{ display: "none" }}
      />
      <div className="img-wrapper">
        <img className="imgSize" src={image.preview_URL} />
      </div>

      <div className="upload-button">
        <Button type="primary" variant="contained" onClick={() => inputRef.click()}>
          Preview
        </Button>
        <Button color="error" variant="contained" onClick={deleteImage}>
          Delete
        </Button>
        <Button color="success" variant="contained" onClick={sendImageToServer}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default Upload;
