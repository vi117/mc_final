import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Co_write.css";
import Form from "react-bootstrap/Form";
import sampledata from "./assets/sampledata";

// 카테고리 옵션
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

const CommunityWrite = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    title: "",
    category: "",
    createdBy: "",
    tag: "",
    contents: "",
  });

  const { title, category, tag, createdBy, contents } = board;

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
      createdBy,
      tag,
      contents,
    };

    sampledata.push(newPost);

    alert("등록되었습니다.");
    navigate("/community");
  };

  const backToList = () => {
    navigate("/community");
  };

  return (
    <div className="write-container">
      <div className="write-wrap">
        <div className="write-header">
          <h4>커뮤니티 글 작성</h4>
        </div>
        <Form.Select
          className="catSelect"
          onChange={(e) => onChange(e)}
          name="category"
          value={category}
        >
          <option className="d-none" value="">
            카테고리를 선택해주세요
          </option>
          {selectList.map((item) => (
            <option
              className="catSelectList"
              value={item.value}
              key={item.value}
            >
              {item.value}
            </option>
          ))}
        </Form.Select>

        <h1 style={{ marginTop: "30px" }}>태그 입력</h1>
        <div>
          <input type="text" name="tag" value={tag} onChange={onChange}></input>
        </div>

        <h1>작성자</h1>
        <div>
          <input
            type="text"
            name="createdBy"
            value={createdBy}
            onChange={onChange}
          />
        </div>
        <h1>커뮤니티 글 작성</h1>
        <input
          type="text"
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={onChange}
          style={{ marginBottom: "-2px" }}
        />
        <div>
          <textarea
            name="contents"
            cols="30"
            rows="10"
            placeholder="5자 이상의 글 내용을 입력해주세요"
            value={contents}
            onChange={onChange}
            minLength={10}
            required={true}
          >
          </textarea>
        </div>
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label className="label">사진 업로드</Form.Label>
          <Form.Control type="file" multiple />
        </Form.Group>
        <div class="submitbutton">
          <button onClick={backToList}>돌아가기</button>
          <button onClick={saveBoard}>글 등록</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityWrite;
