import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import baseClasses from "./styles/Co_base.module.css";
import classes from "./styles/Co_write.module.css";
import "react-quill/dist/quill.snow.css";
import { TagsInput } from "react-tag-input-component";
import { Editor } from "../../component/Editor";
import { ANIMAL_CATEGORY } from "./constant";

const selectList = ANIMAL_CATEGORY.map((v) => ({
  value: v,
}));

const TagWrite = ({
  selected,
  onChange,
}) => {
  return (
    <div>
      <TagsInput
        value={selected}
        onChange={onChange}
        name="fruits"
        placeHolder="태그를 입력해주세요"
      />
    </div>
  );
};

const CommunityWrite = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagSelected, setSelected] = useState(["QnA"]);

  const backToList = () => {
    navigate("/community");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCategory(value);
    }
  };

  return (
    <div className={classes["write-container"]}>
      <div className={classes["write-wrap"]}>
        <div className={classes["write-header"]}>
          <h4>커뮤니티 글 작성</h4>
        </div>
        <Form.Select
          className={classes["catSelect"]}
          onChange={onChange}
          name="category"
          value={category}
        >
          <option className={classes["d-none"]} value="">
            카테고리를 선택해주세요
          </option>
          {selectList.map((item) => (
            <option
              className={classes["catSelectList"]}
              value={item.value}
              key={item.value}
            >
              {item.value}
            </option>
          ))}
        </Form.Select>

        <h1 className={baseClasses["co_h1"]} style={{ marginBottom: "10px" }}>
          태그 입력
        </h1>
        <div
          className={baseClasses["co_tagarea"]}
          style={{ marginBottom: "20px" }}
        >
          <TagWrite selected={tagSelected} onChange={setSelected} />
        </div>
        <h1 className={baseClasses["co_h1"]}>커뮤니티 글 작성</h1>
        <input
          className={baseClasses["co_input"]}
          type="text"
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: "-2px" }}
        />
        <div className={baseClasses["co_textarea"]}>
          <Editor
            className={baseClasses["co_editor"]}
            onChange={(v) => {
              setContent(v);
            }}
            value={content}
          />
        </div>
        <div className={classes["submitbutton"]}>
          <button onClick={backToList}>돌아가기</button>
          <button onClick={sendRequest}>글 등록</button>
        </div>
      </div>
    </div>
  );

  async function sendRequest() {
    const url = new URL("/api/v1/articles/request", window.location.href);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("tags", tagSelected.toString());

    const r = await fetch(url.href, {
      method: "POST",
      body: formData,
    });

    if (r.status === 201) {
      alert("요청이 접수되었습니다.");
    } else {
      alert("요청이 실패했습니다.");
    }
  }
};

export default CommunityWrite;
