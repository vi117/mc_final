import { styled } from "@mui/material";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const placerholder = "https://via.placeholder.com/100x100";

const GridContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
});

const fundings = [
  {
    id: 1,
    title: "funding 1",
    thumbnail: placerholder,
  },
  {
    id: 2,
    title: "funding 1",
    thumbnail: placerholder,
  },
  {
    id: 3,
    title: "funding 1",
    thumbnail: placerholder,
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placerholder,
  },
];

const FundingsHome = function() {
  return (
    <Container style={{ "padding-top": "20px", "width": "50vw" }}>
      <GridContainer>
        {fundings.map((x) => (
          <div key={x.id}>
            <NavLink to={`/fundings/${x.id}`}>
              <img src={x.thumbnail}></img>
              <h3>{x.title}</h3>
            </NavLink>
          </div>
        ))}
      </GridContainer>
    </Container>
  );
};

export default FundingsHome;
