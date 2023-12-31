import clsx from "clsx";
import { FundingObject } from "dto";
import { Card, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { DateToString } from "../../../hook/util";
import { isPSApprovedTag } from "./../../../util/tag";
import classes from "./Item.module.css";
import "./progressbar.css";

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
        <div className={classes["card"]}>
          <NavLink to={`/fundings/${x.id}`}>
            <img
              src={x.thumbnail}
              className={classes["funding_item_thumbnail"]}
              alt="썸네일 이미지"
            />
          </NavLink>
        </div>
        <div className={classes["responsive_wrap"]}>
          <ul className={classes["funding_tags_area"]}>
            {x.tags.map((t) => (
              <li
                key={t.id}
                className={clsx(classes["funding_item_tags"], {
                  [classes["funding_item_tags_emphasis"]]: is_empahsis_tag(
                    t.tag,
                  ),
                  [classes["funding_item_tags_ps_approved"]]: isPSApprovedTag(
                    t,
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
            <span className={classes["progress_currentvalue"]}>
              {x.current_value} 원
            </span>
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
          <ProgressBar
            className="funding_progressbar"
            now={(x.current_value / x.target_value) * 100}
          />
        </div>
      </div>
    </Card>
  );
}

export default FundingItem;
