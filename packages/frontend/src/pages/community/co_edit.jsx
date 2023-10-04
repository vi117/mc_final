import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { Editor } from "../../component/Editor";
import { ANIMAL_CATEGORY } from "./constant";
import baseClasses from "./styles/Co_base.module.css";
import classes from "./styles/Co_write.module.css";

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
        placeHolder="태그를 입력해주세요"
      />
    </div>
  );
};

const CommunityEdit = () => {
  const location = useLocation();
  const item = location.state;
  const [content, setContent] = useState(item?.content ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [tagSelected, setSelected] = useState(
    item?.tags?.map((v) => v.tag) ?? [],
  );
  const navigate = useNavigate();

  const backToList = () => {
    const userConfirmed = window.confirm(
      "지금까지 작성한 내용이 모두 사라집니다.",
    );

    if (userConfirmed) {
      navigate("/community");
    }
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
          <h4>커뮤니티 글 수정</h4>
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
    // TODO(vi117): support tag
    // currently, there is no tag
    // formData.append("tags", tagSelected.toString());

    const r = await fetch(url.href, {
      method: "PATCH",
      body: formData,
    });

    if (r.ok) {
      alert("요청이 접수되었습니다.");
    } else {
      alert("요청이 실패했습니다.");
    }
  }
};

export default CommunityEdit;
