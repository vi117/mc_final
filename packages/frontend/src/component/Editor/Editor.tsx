import { uploadFile as UploadImage } from "@/api/upload";
import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
        alert("이미지를 업로드 할때 문제가 발생했습니다. 다시 시도해주세요.");
        reject(error);
      }
    });
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
    },
  }), []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

export default Editor;
