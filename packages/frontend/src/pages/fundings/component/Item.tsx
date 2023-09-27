import clsx from "clsx";
import { FundingObject } from "dto";
import { Card, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { DateToString } from "../../../hook/util";
import classes from "./Item.module.css";

export function FundingItem({
  item: x,
  is_empahsis_tag = () => false,
  ...rest
}: {
  item: DateToString<FundingObject>;
  is_empahsis_tag?: (tag: string) => boolean;
  [key: string]: unknown;
}) {
  const restTime = new Date(x.end_date).getTime() - new Date().getTime();
  return (
    <Card
      {...rest}
    >
      <div className={classes["funding_card"]}>
        <NavLink to={`/fundings/${x.id}`}>
          <img
            src={x.thumbnail}
            className={classes["funding_item_thumbnail"]}
            alt="썸네일 이미지"
          />
        </NavLink>
        <div>
          <ul className={classes["funding_tags_area"]}>
            {x.tags.map((t) => (
              <li
                className={clsx(classes["funding_item_tags"], {
                  [classes["funding_item_tags_emphasis"]]: is_empahsis_tag(
                    t.tag,
                  ),
                })}
              >
                <NavLink to={`/fundings?tag=${t.tag}`}>
                  #{t.tag}
                </NavLink>
              </li>
            ))}
          </ul>
          <NavLink to={`/fundings/${x.id}`}>
            <div className={classes["funding_item_title"]}>{x.title}</div>
          </NavLink>
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
    </Card>
  );
}

export default FundingItem;
