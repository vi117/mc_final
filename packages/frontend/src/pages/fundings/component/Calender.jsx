import ko from "date-fns/locale/ko";
import { Col, Container, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";

export const Calender = ({
  startDate,
  endDate,
  onChange,
}) => {
  return (
    <Container>
      <Row>
        <Col>
          시작일
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
        </Col>
        <Col>
          종료일
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
        </Col>
      </Row>
    </Container>
  );
};
