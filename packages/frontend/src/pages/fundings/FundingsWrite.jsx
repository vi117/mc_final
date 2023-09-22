import { useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";

// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagsInput } from "react-tag-input-component";

import "react-quill/dist/quill.snow.css";
import { Editor } from "../../component/Editor";
import { Calender } from "./component/Calender";
import { ItemList } from "./component/ItemList";

/**
 * Renders the TagWrite component.
 *
 * @param {Object} props - The props object containing the selected and onChange properties.
 *   - {Array} selected - The array of selected tags.
 *   - {(tags: string[]) => void} onChange - The callback function to handle changes in the selected tags.
 * @return {JSX.Element} The JSX element representing the TagWrite component.
 */
const TagWrite = ({
  selected,
  onChange,
}) => {
  return (
    <div>
      <div>카테고리</div>
      <pre>{JSON.stringify(selected)}</pre>
      <TagsInput
        value={selected}
        onChange={onChange}
        name="fruits"
        placeHolder="enter fruits"
      />
      <em>태그를 입력해주세요.</em>
    </div>
  );
};

const FundingsWrite = function() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tagSelected, setSelected] = useState([]);
  const [thumbnail, setThumbnail] = useState([]);
  const [contentThumbnails, setContentThumbnails] = useState([]);
  const [targetValue, setTargetValue] = useState(0);
  const [content, setContent] = useState("");
  const [rewards, setRewards] = useState([]);

  return (
    <Container style={{ "width": "50vw" }}>
      <Row>
        <TagWrite selected={tagSelected} onChange={setSelected} />
      </Row>

      <Row>
        제목
        <Form.Control
          type="text"
          placeholder="제목을 기입해주세요."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </Row>
      <Row>
        썸네일
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>썸네일 사진을 업로드해주세요.</Form.Label>
          <Form.Control
            type="file"
            // multiple
            // thumbnail 여러개?
            onChange={(e) => {
              console.log(e.target.files);
              setThumbnail(e.target.files);
            }}
          />
        </Form.Group>
        {/* TODO(vi117): title thumbnail과 content thumbnail 을 업로드 */}
      </Row>
      <Row>
        콘텐츠 썸네일
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>콘텐츠 썸네일 사진을 업로드해주세요.</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={(e) => {
              console.log(e.target.files);
              setContentThumbnails(e.target.files);
            }}
          />
        </Form.Group>
      </Row>
      <Row>
        개설기간
        <Calender
          startDate={startDate}
          endDate={endDate}
          onChange={(e) => {
            setStartDate(e.startDate);
            setEndDate(e.endDate);
          }}
        />
      </Row>

      <Row>
        목표금액
        <Form.Control
          type="text"
          placeholder="목표금액(숫자만)"
          pattern="[0-9]*"
          value={targetValue}
          onChange={(e) => setTargetValue(parseInt(e.target.value))}
        />
      </Row>

      <Row>
        <Editor
          onChange={(v) => {
            setContent(v);
          }}
          value={content}
        />
      </Row>

      <Row>
        <ItemList
          onChange={(v) => {
            setRewards(v);
            console.log(v);
          }}
        />
      </Row>

      <Row>
        계좌연결
        <Form.Select aria-label="Default select example">
          <option>은행명</option>
          <option value="1">기업</option>
          <option value="2">국민</option>
          <option value="3">신한</option>
        </Form.Select>
        <Form.Control type="text" placeholder="계좌번호" />
      </Row>

      <Row>
        증명등록
        <Form.Label>
          증명등록에 필요한 파일을
          업로드해주세요.(주민등록증or사업자등록증)(인증서)
        </Form.Label>
        <Form.Control type="file" multiple />
      </Row>

      <Row>
        완료
        <Button
          variant="success"
          onClick={() => {
            sendRequest();
          }}
        >
          완료
        </Button>
      </Row>
    </Container>
  );
  async function sendRequest() {
    console.log("sendRequest");
    const url = new URL("/api/v1/fundings/request", window.location.href);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("thumbnail", thumbnail[0]);
    [...contentThumbnails].forEach((file) => {
      formData.append("content_thumbnail", file);
    });
    formData.append("content", content);
    formData.append("target_value", parseInt(targetValue));
    formData.append("begin_date", startDate.toISOString());
    formData.append("end_date", endDate.toISOString());
    formData.append("tags", tagSelected.toString());
    formData.append("rewards", JSON.stringify(rewards));

    const r = await fetch(url.href, {
      method: "POST",
      body: formData,
    });

    if (r.status === 201) {
      // TODO(vi117): toast 띄우기.
      alert("요청이 접수되었습니다.");
    } else {
      alert("요청이 실패되었습니다.");
    }
  }
};

export default FundingsWrite;
