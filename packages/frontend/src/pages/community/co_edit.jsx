import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import sampledata from "./assets/sampledata";
import baseClasses from "./styles/Co_base.module.css";
import classes from "./styles/Co_write.module.css";

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
const CommunityEdit = () => {
  const navigate = useNavigate();
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
  const initialBoardState = fetcherData || {
    title: "",
    category: "",
    tag: "",
    contents: "",
  };
  const [board, setBoard] = useState(initialBoardState);
  const { title, category, tag, contents } = board;
  const onChange = (event) => {
    const { value, name } = event.target; // event.target에서 name과 value만 가져오기
    setBoard({
      ...board,
      [name]: value,
    });
  };

  const saveBoard = async () => {
    const newPost = {
      title,
      category,
      tag,
      contents,
    };
    sampledata.push(newPost);

    alert("등록되었습니다.");
    navigate("/community");
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
          onChange={(e) => onChange(e)}
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

        <h1 className={baseClasses["co_h1"]} style={{ marginTop: "30px" }}>
          태그 입력
        </h1>
        <div>
          <input
            className={baseClasses["co_input"]}
            type="text"
            name="tag"
            value={item.tag}
            onChange={onChange}
          >
          </input>
        </div>
        <h1 className={baseClasses["co_h1"]}>커뮤니티 글 작성</h1>
        <input
          className={baseClasses["co_input"]}
          type="text"
          name="title"
          value={item.title}
          onChange={onChange}
          style={{ marginBottom: "-2px" }}
        />
        <div>
          <textarea
            className={baseClasses["co_textarea"]}
            name="contents"
            cols="30"
            rows="10"
            value={item.content}
            onChange={onChange}
            minLength={10}
            required={true}
          >
          </textarea>
        </div>
        <Form.Group controlId="formFileMultiple" className={"mb-3 w-100"}>
          <Form.Label className={classes["label"]}>사진 업로드</Form.Label>
          <Form.Control type="file" multiple />
        </Form.Group>
        <div className={classes["submitbutton"]}>
          <Link to={`/community/${item.id}`}>
            <button>돌아가기</button>
          </Link>
          <button onClick={saveBoard}>글 등록</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityEdit;
