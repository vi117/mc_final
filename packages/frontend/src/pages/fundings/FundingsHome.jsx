import { styled } from "@mui/material";
import { useState } from "react";
import { Badge, Card, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import useFundings from "../../hook/useFundings";
import classes from "./FundingsHome.module.css";
// import "./FundingsHome_Item.css"

// const placerholder = "https://via.placeholder.com/100x100";

const GridContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gridGap: "12px",
  justifyContent: "center",
});

// const fundings = [
//   {
//     id: 1,
//     title: "funding 1",
//     thumbnail: placerholder,
//     tag: "고양이",
//     content:"aaaaaaaaaaaaaaaa",
//     target_value:1000,
//     current_value:500,

//   },
//   {
//     id: 2,
//     title: "funding 1",
//     thumbnail: placerholder,
//     tag: "고양이",
//     content:"aaaaaaaaaaaaaaaa",
//     target_value:"1000",
//     current_value:"500",
//   },
//   {
//     id: 3,
//     title: "funding 1",
//     thumbnail: placerholder,
//     tag: "고양이",
//     content:"aaaaaaaaaaaaaaaa",
//     target_value:"1000",
//     current_value:"500",
//   },
//   {
//     id: 4,
//     title: "funding 1",
//     thumbnail: placerholder,
//     tag: "고양이",
//     content:"aaaaaaaaaaaaaaaa",
//     target_value:"1000",
//     current_value:"500",
//   },
// ];

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
    return <div>로딩중...</div>;
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
              ? "태그 검색으로 원하는 펀딩을 찾아보세요!"
              : ""}
          />
        </div>

        <div className={classes["funding_createbtn"]}>
          <NavLink to={"/fundings/post"}>
            <p className={classes["go_create"]}>펀딩 만들기</p>
          </NavLink>
        </div>
      </div>
      <GridContainer className={classes["funding_itemarea"]}>
        {fetcherData.map((x) => (
          <FundingItem
            className={classes["funding_item"]}
            key={x.id}
            item={x}
          />
        ))}
      </GridContainer>
    </div>
  );
};

function FundingItem({
  item: x,
  ...rest
}) {
  return (
    <Card
      className={classes["funding_card"]}
      key={x.id}
      {...rest}
    >
      <NavLink to={`/fundings/${x.id}`}>
        <img
          src={x.thumbnail}
          className={classes["funding_item_thumbnail"]}
          alt="썸네일 이미지"
        />
        <div>{x.tags.map((t) => <Badge>{t.tag}</Badge>)}</div>
        <h5>{x.title}</h5>
        {/* <h6>{x.content}</h6> */}
        <div>
          <ProgressBar
            now={(x.current_value / x.target_value) * 100}
            label={((x.current_value / x.target_value) * 100).toFixed(2)
              + "%"}
          />
        </div>
      </NavLink>
    </Card>
  );
}

export default FundingsHome;
