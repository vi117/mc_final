import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import classes from "../FundingWrite.module.css";
import "./datepicker.css";

export const Calender = ({
  startDate,
  endDate,
  onChange,
}) => {
  return (
    <div className={classes.date_area}>
      <span>시작일</span>
      <DatePicker
        className={classes.date_picker}
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
      <span>종료일</span>
      <DatePicker
        className={classes.date_picker}
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
    </div>
  );
};
