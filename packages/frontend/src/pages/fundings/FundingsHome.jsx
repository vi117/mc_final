import { useState } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import useFundings from "../../hook/useFundings";
import classes from "./FundingsHome.module.css";
import "./progressbar.css";
import "../community/styles/tags.css";
import FundingsHome_placeholder from "./FundingsHome_placeholder";
// import "./FundingsHome_Item.css"

// const placerholder = "https://via.placeholder.com/100x100";

// const GridContainer = styled("div")({
//   display: "grid",
//   gridTemplateColumns: "repeat(3, 1fr)",
//   gridGap: "20px",
//   justifyContent: "center",
// });

const FundingsHome = function() {
  const [selected, setSelected] = useState([]);
  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useFundings({
    offset: 0,
    limit: 50,
    tags: selected.length > 0 ? selected : undefined,
  });

  if (fetcherIsLoading) {
    return <FundingsHome_placeholder />;
  }

  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <div className={classes["funding_container"]}>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <div className={classes["funding_navarea"]}>
        <div className={classes["funding_tagsearch"]}>
          <TagsInput
            value={selected}
            onChange={setSelected}
            name="fruits"
            placeHolder={selected.length === 0
              ? "태그로 원하는 펀딩을 찾아보세요!"
              : ""}
          />
        </div>

        <div className={classes["funding_createbtn"]}>
          <NavLink to={"/fundings/post"}>
            <p className={classes["go_create"]}>펀딩 만들기</p>
          </NavLink>
        </div>
      </div>
      <div className={classes["funding_itemarea"]}>
        {fetcherData.map((x) => (
          <FundingItem
            style={{ border: "none" }}
            key={x.id}
            item={x}
          />
        ))}
      </div>
    </div>
  );
};

function FundingItem({
  item: x,
  ...rest
}) {
  const restTime = new Date(x.end_date).getTime() - new Date().getTime();
  return (
    <Card
      key={x.id}
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
              {Math.round((x.current_value / x.target_value) * 100).toFixed(0)
                + "%"}달성!
              <span>{x.current_value} 원</span>
              <span className={classes["progress_resttime"]}>
                {Math.round((restTime / (1000 * 60 * 60 * 24)).toFixed(0))}일
                남음
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

export default FundingsHome;
