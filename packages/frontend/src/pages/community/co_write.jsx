import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { Editor } from "../../component/Editor";
import { ANIMAL_CATEGORY } from "./constant";
import baseClasses from "./styles/Co_base.module.css";
import classes from "./styles/Co_write.module.css";
import "./styles/tags.css";
import Cowritemodal from "./components/co_writemodal";

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
        placeHolder="엔터로 태그를 입력해주세요"
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
  const [showModal, setShowModal] = useState(true);

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
      {
        <Cowritemodal
          show={showModal}
          handleClose={() => setShowModal(false)}
        >
        </Cowritemodal>
      }
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
    const url = new URL("/api/v1/articles/", window.location.href);
    const r = await fetch(url.href, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        category,
      }),
    });

    if (r.status === 201) {
      // TODO(vi117): navigate
      alert("요청이 접수되었습니다.");
      navigate("/community");
    } else {
      alert("요청이 실패했습니다.");
    }
  }
};

export default CommunityWrite;
