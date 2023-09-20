import { styled } from "@mui/material";
import { useState } from "react";
import { Button, Container, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import useSWR from "swr";
import "./FundingsDetail.css";
// import classes from "./FundingsHome.css?inline";

// const placerholder = "https://via.placeholder.com/100x100";

const GridContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  // col-md
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

const TagSelcection = () => {
  const [selected, setSelected] = useState(["태그1"]);

  return (
    <div>
      <div>카테고리</div>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <TagsInput
        value={selected}
        onChange={setSelected}
        name="fruits"
        placeHolder="enter fruits"
      />
      {/* <em>태그를 입력해주세요.</em> */}
    </div>
  );
};

const FundingsHome = function() {
  const url = new URL("/api/v1/fundings", window.location.href);
  url.searchParams.append("offset", 0);
  url.searchParams.append("limit", 50);

  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useSWR(
    url.href,
    (url) => fetch(url).then((res) => res.json()),
  );

  if (fetcherIsLoading) {
    return <div>로딩중...</div>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <Container style={{ "padding-top": "20px", "width": "50vw" }}>
      <div style={{ "text-align": "right" }}>
        <NavLink to={"/fundings/post"}>
          <Button variant="success">작성</Button>
        </NavLink>
      </div>
      <TagSelcection />
      <GridContainer>
        {fetcherData.map((x) => (
          <div key={x.id} style={{ paddingRight: "15px", width: "150px" }}>
            <NavLink to={`/fundings/${x.id}`}>
              <img
                src={x.thumbnail}
                style={{ width: "100%" }}
                alt="썸네일 이미지"
              />
              <div>{x.tag}</div>
              <h5>{x.title}</h5>
              <div className="zzzzzzzzzzzzzzz">{x.content}</div>
              <div>
                <ProgressBar
                  now={(x.current_value / x.target_value) * 100}
                  label={(x.current_value / x.target_value) * 100}
                />
              </div>
            </NavLink>
          </div>
        ))}
      </GridContainer>
    </Container>
  );
};

export default FundingsHome;
