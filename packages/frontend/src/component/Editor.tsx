import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";

function ImageHandler(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    // 속성 써주기
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener("change", async () => {
      if (!input.files || input.files.length === 0) {
        return;
      }
      const file = input.files[0];
      try {
        const result = await UploadImage(file);
        resolve(result);
      } catch (error) {
        console.error("server error", error);
        reject(error);
      }
    });
  });
}

function getFileArrayBuffer(file: File): Promise<ArrayBuffer> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.addEventListener("load", function() {
      if (typeof reader.result === "string") {
        resolve(new ArrayBuffer(reader.result.length));
      }
      if (typeof reader.result === "object") {
        resolve(reader.result as ArrayBuffer);
      }
      reject();
    }, false);
    reader.readAsArrayBuffer(file);
  });
}

export const Editor = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: ReactQuill.Value;
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
      handlers: {
        image: () => {
          ImageHandler().then((url) => {
            if (quillRef.current) {
              console.log(url);
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection();
              if (range == null) {
                return;
              }
              editor.insertEmbed(range.index, "image", url);
            }
          });
        },
      },
      // imageUploader: {
      //   upload: (file: File) => {
      //     console.log(file);
      //     return UploadImage(file).then((url) => {
      //       return url;
      //     });
      //   },
      // },
    },
  }), []);

  return (
    <ReactQuill
      ref={quillRef}
      style={{ height: "330px" }}
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

async function UploadImage(file: File) {
  const formData = new FormData();
  const buf = await getFileArrayBuffer(file);
  const blob = new Blob([buf], { type: file.type });
  formData.append("file", blob, file.name);
  const url = new URL("/api/v1/upload", window.location.origin);
  const res = await fetch(url.href, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("server error");
  }
  return (await res.json()).url;
}
