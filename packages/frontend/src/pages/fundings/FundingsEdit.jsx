import { useState } from "react";
import { Button, Container, Image, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const FundingsEdit = function() {
  return (
    <Container style={{ "width": "50vw" }}>
      <h1>수정할 수 있는 사항만 남겨둘 것.</h1>
      <Row>태그///////////////</Row>
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
        <Form.Control type="text" placeholder="목표금액(숫자만)" />원
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
      <Row>상세페이지에디터///////////</Row>

      <Row>
        리워드아이템설정//////////
        <Container>
          <Button variant="success">+</Button>
          <Row>
            금액
            <Form.Control type="text" placeholder="계좌번호" />
          </Row>
          <Row>
            제목
            <Form.Control type="text" placeholder="계좌번호" />
          </Row>
          <Row>
            설명
            <Form.Control type="text" placeholder="계좌번호" />
          </Row>
        </Container>
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
        <NavLink to={"/fundings"}>
          <Button variant="success">참가</Button>
        </NavLink>
      </Row>
    </Container>
  );
};

export default FundingsEdit;
