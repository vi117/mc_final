import ReactQuill from "react-quill";

export const Editor = ({
  onChange,
  value,
}) => {
  return (
    <ReactQuill
      style={{ height: "330px" }}
      value={value}
      onChange={onChange}
      modules={{
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"],
            ["link", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
      }}
    />
  );
};
