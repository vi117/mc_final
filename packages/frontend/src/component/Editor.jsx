import ReactQuill from "react-quill";

export const Editor = ({
  onChange,
  value,
}) => {
  return (
    <div>
      <ReactQuill
        style={{ height: "400px" }}
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
    </div>
  );
};
