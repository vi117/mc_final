import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import useSWR from "swr";
import { Editor } from "../../component/Editor";
import baseClasses from "./styles/Co_base.module.css";
import classes from "./styles/Co_write.module.css";
import "react-quill/dist/quill.snow.css";

let selectList = [
  { value: "강아지" },
  { value: "고양이" },
  { value: "햄스터" },
  { value: "어류" },
  { value: "조류" },
  { value: "파충류" },
  { value: "양서류" },
  { value: "갑각류" },
  { value: "기타" },
];
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
const CommunityEdit = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagSelected, setSelected] = useState(["QnA"]);

  const { id } = useParams();
  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useSWR(
    `/api/v1/articles/${id}`,
    (url) => fetch(url).then((res) => res.json()),
  );
  const item = fetcherData;
  // const initialBoardState = fetcherData || {
  //   title: "",
  //   category: "",
  //   tag: "",
  //   contents: "",
  // };
  // const [board, setBoard] = useState(initialBoardState);
  // const { title, category, tag, contents } = board;
  // const onChange = (event) => {
  //   const { value, name } = event.target; // event.target에서 name과 value만 가져오기
  //   setBoard({
  //     ...board,
  //     [name]: value,
  //   });
  // };

  // const saveBoard = async () => {
  //   const newPost = {
  //     title,
  //     category,
  //     tag,
  //     contents,
  //   };
  //   sampledata.push(newPost);

  //   alert("등록되었습니다.");
  //   navigate("/community");
  // };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCategory(value);
    }
  };

  if (fetcherIsLoading) {
    return <div>로딩중...</div>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }

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
          value={item.title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: "-2px" }}
        />
        <div className={baseClasses["co_textarea"]}>
          <Editor
            className={baseClasses["co_editor"]}
            onChange={(v) => {
              setContent(v);
            }}
            value={item.content}
          />
        </div>
        <div className={classes["submitbutton"]}>
          <button>돌아가기</button>
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

export default CommunityEdit;
