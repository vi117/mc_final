import { useState } from "react";
import { Component } from "react";
import { Button, Container, Image, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";

import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagsInput } from "react-tag-input-component";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const dummyImage = "https://via.placeholder.com/250x250";

const Calender = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  return (
    <Container>
      <DatePicker
        showIcon // 달력 아이콘 표시인것 같은데 안보임
        selected={startDate}
        onChange={(date) => setStartDate(date)}
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
        onChange={(date) => setEndDate(date)}
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

const TagSelcection = () => {
  const [selected, setSelected] = useState(["papaya"]);

  return (
    <div>
      <div>카테고리</div>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <TagsInput
        value={selected}
        onChange={setSelected}
        name="fruits"
        placeHolder="enter fruits"
      />
      <em>태그를 입력해주세요.</em>
    </div>
  );
};

const Editor = () => {
  const [text, setText] = useState("");

  const handleChange = (value) => {
    setText(value);
  };

  return (
    <div>
      <ReactQuill
        value={text}
        onChange={handleChange}
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
      items: [], // 물건 목록을 저장할 상태
      newItemName: "", // 새 물건의 이름을 저장할 상태
      newItemDesc: "", // 새 물건의 설명을 저장할 상태
      newItemPrice: "", // 새 물건의 가격을 저장할 상태
    };
  }

  // 새 물건을 추가하는 함수
  addItem = () => {
    const { newItemName, newItemDesc, newItemPrice } = this.state;
    if (newItemName && newItemDesc && newItemPrice) {
      const newItem = {
        name: newItemName,
        description: newItemDesc,
        price: newItemPrice,
      };

      this.setState(prevState => ({
        items: [...prevState.items, newItem],
        newItemName: "",
        newItemDesc: "",
        newItemPrice: "",
      }));
    }
  };

  // 물건을 삭제하는 함수
  deleteItem = (index) => {
    const updatedItems = [...this.state.items];
    updatedItems.splice(index, 1);
    this.setState({ items: updatedItems });
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
        <button onClick={this.addItem}>추가</button>

        <ul>
          {this.state.items.map((item, index) => (
            <li key={index} style={{ "listStyleType": "None" }}>
              <strong>{item.name}</strong> - {item.description} - {item.price}
              <button
                onClick={() =>
                  this.deleteItem(index)}
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
  return (
    <>
      <h1>수정가능한 부분만 남길것</h1>
      <Container style={{ "border": "1px solid red", "width": "50vw" }}>
        <Row>
          <TagSelcection />
        </Row>

        <Row>
          제목
          <Form.Control type="text" placeholder="제목을 기입해주세요." />
        </Row>
        <Row>
          썸네일
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>썸네일 사진을 업로드해주세요.</Form.Label>
            <Form.Control type="file" multiple />
          </Form.Group>
        </Row>
        <Row>
          개설기간
          <Calender />
        </Row>

        <Row>
          목표금액
          <Form.Control type="text" placeholder="목표금액(숫자만)" />
        </Row>
        ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
        <Row style={{ "width": "250px" }}>
          유저.사진
          <Image src={dummyImage} roundedCircle />
        </Row>
        <Row>
          유저.이름
          <Form.Control type="text" placeholder="유저.닉네임" />
        </Row>
        <Row>
          유저.소개글
          <Form.Control type="text" placeholder="유저.한줄소개" />
        </Row>
        <Row>
          유저.전화번호
          <Form.Control type="text" placeholder="유저.phone" />
        </Row>
        <Row>
          유저.이메일
          <Form.Control type="text" placeholder="유저.email" />
        </Row>

        ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
        <Row>
          <Editor />
        </Row>

        <Row>
          <ItemList />
        </Row>
        ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
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
          <Button variant="success">완료</Button>
        </Row>
      </Container>
    </>
  );
};

export default FundingsWrite;
