// import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";

// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { ko } from "date-fns";

// const Example = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   return <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />;
// };

const FundingsWrite = function() {
  return (
    <Container>
      <Row>태그</Row>
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
        {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */}
      </Row>
      <Row>목표금액</Row>
      <Row>유저.이름</Row>
      <Row>유저.사진</Row>
      <Row>유저.소개글</Row>
      <Row>유저.전화번호</Row>
      <Row>유저.이메일</Row>
      <Row>상세페이지 에디터</Row>
      <Row>리워드아이템설정</Row>
      <Row>계좌연결</Row>
      <Row>증명등록</Row>
      <Row>완료버튼</Row>
    </Container>
  );
};

export default FundingsWrite;
