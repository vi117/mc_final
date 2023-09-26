import { FundingObject } from "dto";
import { Card, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { DateToString } from "../../../hook/util";
import classes from "../FundingsHome.module.css";

export function FundingItem({
  item: x,
  ...rest
}: {
  item: DateToString<FundingObject>;
  [key: string]: unknown;
}) {
  const restTime = new Date(x.end_date).getTime() - new Date().getTime();
  return (
    <Card
      {...rest}
    >
      <NavLink to={`/fundings/${x.id}`}>
        <div className={classes["funding_card"]}>
          <img
            src={x.thumbnail}
            className={classes["funding_item_thumbnail"]}
            alt="썸네일 이미지"
          />
          <div>
            <div className={classes["funding_tags_area"]}>
              {x.tags.map((t) => (
                <ul className={classes["funding_item_tags"]}>
                  <li>{t.tag}</li>
                </ul>
              ))}
            </div>
            <div className={classes["funding_item_title"]}>{x.title}</div>
            {/* <h6>{x.content}</h6> */}

            <div className={classes["funding_progress_percantage"]}>
              {((x.current_value / x.target_value) * 100).toFixed(0)
                + "%"}달성!
              <span>{x.current_value} 원</span>
              <span className={classes["progress_resttime"]}>
                {restTime / (1000 * 60 * 60 * 24) > 0
                  ? (
                    <>
                      {(restTime / (1000 * 60 * 60 * 24)).toFixed(0)}일 남음
                    </>
                  )
                  : <>종료</>}
              </span>
            </div>
            <div>
              <ProgressBar
                className="funding_progressbar"
                now={(x.current_value / x.target_value) * 100}
              />
            </div>
          </div>
        </div>
      </NavLink>
    </Card>
  );
}

export default FundingItem;
