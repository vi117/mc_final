import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import classes from "./Calender.module.css";
import "./datepicker.css";

export const Calender = ({
  startDate,
  endDate,
  onChange,
}: {
  startDate: Date;
  endDate: Date;
  onChange: (date: {
    startDate: Date;
    endDate: Date;
  }) => void;
}) => {
  return (
    <div className={classes.date_area}>
      <div className={classes.date_item}>
        <span>시작일</span>
        <DatePicker
          className={classes.date_picker}
          selected={startDate}
          onChange={(date) =>
            onChange({
              startDate: date ?? new Date(),
              endDate,
            })}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale={ko}
          dateFormat="yyyy년 MM월 dd일"
        />
      </div>
      <div className={classes.date_item}>
        <span>종료일</span>
        <DatePicker
          className={classes.date_picker}
          selected={endDate}
          onChange={(date) =>
            onChange({
              endDate: date ?? new Date(),
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
    </div>
  );
};

export default Calender;
