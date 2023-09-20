import ko from "date-fns/locale/ko";
import { Container } from "react-bootstrap";
import DatePicker from "react-datepicker";

export const Calender = ({
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
