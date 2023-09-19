// import { styled } from "@mui/material";
import { useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
// import useSWR from "swr";

const placerholder = "https://via.placeholder.com/100x100";

// const GridContainer = styled("div")({
//   display: "flex",
//   flexWrap: "wrap",
// });

const fundings = [
  {
    id: 1,
    title: "funding 1",
    thumbnail: placerholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: 1000,
    current_value: 500,
  },
  {
    id: 2,
    title: "funding 1",
    thumbnail: placerholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 3,
    title: "funding 1",
    thumbnail: placerholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placerholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placerholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placerholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placerholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
];

const TagSelcection = () => {
  const [selected, setSelected] = useState(["태그1", "태그2"]);

  return (
    <div>
      <div>카테고리</div>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <TagsInput
        value={selected}
        onChange={setSelected}
        name="animals"
        placeHolder="enter tags"
      />
      {/* <em>태그를 입력해주세요.</em> */}
    </div>
  );
};

const FundingsHome = function() {
  // const {
  //   data: fetcherData,
  //   error: fetcherError,
  //   isLoading: fetcherIsLoading,
  // } = useSWR(
  //   "/api/v1/fundings",
  //   (url) => fetch(url).then((res) => res.json()),
  // );

  // if (fetcherIsLoading) {
  //   return <div>로딩중...</div>;
  // }
  // if (fetcherError) {
  //   return <div>에러가 발생했습니다.</div>;
  // }

  return (
    <Container style={{ "padding-top": "20px", "width": "50vw" }}>
      <div style={{ "text-align": "right" }}>
        <NavLink to={"/fundings/:id/post"}>
          <Button variant="success">작성</Button>
        </NavLink>
      </div>
      <TagSelcection />
      <Container>
        <Row md={4} xs={2}>
          {fundings.map((x) => (
            <div key={x.id}>
              <NavLink to={`/fundings/${x.id}`}>
                <img
                  src={x.thumbnail}
                  style={{ width: "100%" }}
                  alt="썸네일 이미지"
                />
                <div>{x.tag}</div>
                <h3>{x.title}</h3>
                <div style={{ "overflow": "ellipsis" }}>{x.content}</div>
                <h3>달성도:{(x.current_value / x.target_value) * 100}%</h3>
              </NavLink>
            </div>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default FundingsHome;
