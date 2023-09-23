import { styled } from "@mui/material";
import { useState } from "react";
import { Badge, Button, Card, Container, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
// import { TagsInput } from "react-tag-input-component";
import SearchModalBasic from "../../component/SearchModalBasic";
import useFundings from "../../hook/useFundings";

// const placerholder = "https://via.placeholder.com/100x100";

const GridContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridGap: "12px",
  justifyContent: "center",
  marginLeft: "12.5px",
});

const FundingsHome = function() {
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
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

  // 모달창 노출 여부 state

  // 모달창 노출
  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <Container style={{ paddingTop: "20px", "width": "860px" }}>
      <div style={{ textAlign: "right" }}>
        <NavLink to={"/fundings/post"}>
          <Button variant="success">작성</Button>
        </NavLink>
      </div>

      <div>카테고리</div>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <input
        width="860px"
        value={selected}
        onChange={setSelected}
        name="fruits"
        placeHolder="enter..."
        onClick={openModal}
      />
      {modalOpen && <SearchModalBasic setModalOpen={setModalOpen} />}

      <GridContainer
        style={{
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        {fetcherData.map((x) => (
          <FundingItem
            key={x.id}
            item={x}
            style={{
              padding: "4px",
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
    <Card
      key={x.id}
      {...rest}
    >
      <NavLink to={`/fundings/${x.id}`}>
        <img
          src={x.thumbnail}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
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
