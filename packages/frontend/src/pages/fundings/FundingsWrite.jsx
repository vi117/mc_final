import { useState } from "react";
import { Component } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";

import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagsInput } from "react-tag-input-component";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Calender = ({
  startDate,
  endDate,
  onChange,
}) => {
  return (
    <Container>
      <DatePicker
        showIcon // 달력 아이콘 표시인것 같은데 안보임
        selected={startDate}
        onChange={(date) =>
          onChange({
            startDate: date,
            endDate,
          })}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
      />
      ~
      <DatePicker
        showIcon
        selected={endDate}
        onChange={(date) =>
          onChange({
            endDate: date,
            startDate,
          })}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
      />
    </Container>
  );
};

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

const Editor = ({
  onChange,
  value,
}) => {
  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={{
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["link", "image"], // 이미지 업로드 버튼 추가
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        }}
      />
    </div>
  );
};
class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * @type {Array}
       */
      items: [], // 물건 목록을 저장할 상태
      newItemName: "", // 새 물건의 이름을 저장할 상태
      newItemDesc: "", // 새 물건의 설명을 저장할 상태
      newItemPrice: "", // 새 물건의 가격을 저장할 상태
      newItemCount: "",
    };
  }

  // 새 물건을 추가하는 함수
  addItem = () => {
    const { newItemName, newItemDesc, newItemPrice, newItemCount } = this.state;
    if (newItemName && newItemDesc && newItemPrice) {
      const newItem = {
        title: newItemName,
        content: newItemDesc,
        price: parseInt(newItemPrice),
        reward_count: parseInt(newItemCount),
      };

      this.setState(prevState => ({
        items: [...prevState.items, newItem],
        newItemName: "",
        newItemDesc: "",
        newItemPrice: "",
        newItemCount: "",
      }));
      this.props.onChange?.([...this.state.items, newItem]);
    }
  };

  // 물건을 삭제하는 함수
  deleteItem = (index) => {
    const updatedItems = [...this.state.items];
    updatedItems.splice(index, 1);
    this.setState({ items: updatedItems });
    this.props.onChange?.(updatedItems);
  };

  render() {
    return (
      <div>
        <div>리워드 추가</div>
        <input
          type="text"
          placeholder="이름"
          value={this.state.newItemName}
          onChange={(e) => this.setState({ newItemName: e.target.value })}
        />
        <input
          type="text"
          placeholder="설명"
          value={this.state.newItemDesc}
          onChange={(e) => this.setState({ newItemDesc: e.target.value })}
        />
        <input
          type="text"
          placeholder="가격"
          value={this.state.newItemPrice}
          onChange={(e) => this.setState({ newItemPrice: e.target.value })}
        />
        <input
          type="text"
          placeholder="수량"
          value={this.state.newItemCount}
          onChange={(e) => this.setState({ newItemCount: e.target.value })}
        />
        <button
          onClick={() => {
            this.addItem();
          }}
        >
          추가
        </button>

        <ul>
          {this.state.items.map((item, index) => (
            <li key={index} style={{ "listStyleType": "None" }}>
              <strong>{item.title}</strong> - {item.content} - {item.price} -
              {item.reward_count}
              <button
                onClick={() => {
                  this.deleteItem(index);
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const FundingsWrite = function() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tagSelected, setSelected] = useState(["papaya"]);
  const [thumbnail, setThumbnail] = useState([]);
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
        완료버튼
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
    const url = new URL("/api/v1/fundings/request", window.location.href);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("thumbnail", thumbnail[0]);
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
