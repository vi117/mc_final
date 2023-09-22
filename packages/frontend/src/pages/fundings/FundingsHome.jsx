import { styled } from "@mui/material";
import { useState } from "react";
import { Badge, Button, Container, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import useFundings from "../../hook/useFundings";

// const placerholder = "https://via.placeholder.com/100x100";

const GridContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  marginLeft: "12.5px",
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
    <Container style={{ paddingTop: "20px", "width": "860px" }}>
      <div style={{ textAlign: "right" }}>
        <NavLink to={"/fundings/post"}>
          <Button variant="success">작성</Button>
        </NavLink>
      </div>

      <div>카테고리</div>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <TagsInput
        width="860px"
        value={selected}
        onChange={setSelected}
        name="fruits"
        placeHolder="enter..."
      />

      <GridContainer
        style={{
          marginTop: "10px",
        }}
      >
        {fetcherData.map((x) => (
          <FundingItem
            key={x.id}
            item={x}
            style={{
              flex: "0 0 calc(33.33% - 25px)",
              marginRight: "10px",
              marginBottom: "10px",
              // height:"200px"
            }}
          />
        ))}
      </GridContainer>
    </Container>
  );
};

function FundingItem({
  item: x,
  ...rest
}) {
  return (
    <div
      key={x.id}
      {...rest}
    >
      <NavLink to={`/fundings/${x.id}`}>
        <img
          src={x.thumbnail}
          style={{
            width: "100%",
            height: "auto",
          }}
          alt="썸네일 이미지"
        />
        <div>{x.tags.map((t) => <Badge>{t.tag}</Badge>)}</div>
        <h5>{x.title}</h5>
        <h6>{x.content}</h6>
        <div>
          <ProgressBar
            now={(x.current_value / x.target_value) * 100}
            label={((x.current_value / x.target_value) * 100).toFixed(2)
              + "%"}
          />
        </div>
      </NavLink>
    </div>
  );
}

export default FundingsHome;
