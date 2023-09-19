import {
  Badge,
  Button,
  ButtonGroup,
  Carousel,
  Container,
  Dropdown,
  DropdownButton,
  ListGroup,
} from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import "./FundingsDetail.css";
import { NavLink } from "react-router-dom";
// import useSWR from "swr";

const placeholder = "https://via.placeholder.com/850x375";

const fundings = [
  {
    id: 1,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: 1000,
    current_value: 500,
  },
  {
    id: 2,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 3,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
];

const rewards = [
  {
    id: 1,
    funding_id: 1,
    title: "funding 1",
    content: "펀딩 1 설명",
    price: 10000,
    reward_current_count: 1,
    reward_count: 999,
  },
  {
    id: 1,
    funding_id: 2,
    title: "funding 2",
    content: "펀딩 2 설명",
    price: 20000,
    reward_current_count: 1,
    reward_count: 999,
  },
  {
    id: 1,
    funding_id: 3,
    title: "funding 3",
    content: "펀딩 3 설명",
    price: 10000,
    reward_current_count: 1,
    reward_count: 999,
  },
  {
    id: 1,
    funding_id: 4,
    title: "funding 1",
    content: "펀딩 1 설명",
    price: 10000,
    reward_current_count: 1,
    reward_count: 999,
  },
  {
    id: 1,
    funding_id: 5,
    title: "funding 1",
    content: "펀딩 1 설명",
    price: 10000,
    reward_current_count: 1,
    reward_count: 999,
  },
];

const FundingsDetail = function() {
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
      <div className="sujung">
        <NavLink to={"/fundings/1/edit"}>
          <Button variant="success">수정</Button>
        </NavLink>
      </div>
      <Row>
        <Col sm={8} className="fundingName">
          <h1>펀딩 제목</h1>
          {/* <div>{fundings.title}</div> */}
        </Col>

        <Col className="tags">
          <div>
            <Badge>tag1</Badge>
            <Badge>tag2</Badge>
          </div>
          {/* <div>{fundings.tag}</div> */}
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          <Carousel slide={false}>
            <Carousel.Item>
              <img src={placeholder} text="First slide" />
              <Carousel.Caption>
                <h3>썸네일 Carousel or 사진한장</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={placeholder} text="Second slide" />
              <Carousel.Caption>
                <h3>썸네일 Carousel or 사진한장</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={placeholder} text="Third slide" />
              <Carousel.Caption>
                <h3>Third slide label</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>

        <Col sm={4}>
          <Row style={{ margin: "16px" }}>
            <div key={`${fundings.id}`}>
              <div>{fundings.begin_date}</div>
              <div>{fundings.end_date}</div>
              <div>
                달성도:{(fundings.current_value / fundings.target_value) * 100}%
              </div>
            </div>
            <div></div>개설기간, 달성도(후원자 명수)
            {
              /* {fetcherData.map((x) => (
          <div key={x.id}>
            <NavLink to={`/fundings/${x.id}`}>
              <img src={x.thumbnail} alt="썸네일 이미지"></img>
              <h3>{x.tag}</h3>
              <h3>{x.title}</h3>
              <h3>{x.content}</h3>
              <h3>{(x.current_value / x.target_value) * 100}%</h3>
            </NavLink> */
            }
          </Row>

          <Row>
            <div></div>펀딩 창작자 소개
          </Row>
          <Row style={{ "padding": "10px 0px 10px 0px" }}>
            <Col className="sns">
              <ButtonGroup vertical>
                <DropdownButton
                  as={ButtonGroup}
                  title="공유하기💌"
                  id="bg-vertical-dropdown-1"
                >
                  <Dropdown.Item eventKey="1">인스타</Dropdown.Item>
                  <Dropdown.Item eventKey="2">네이버블로그</Dropdown.Item>
                  <Dropdown.Item eventKey="3">트위터X</Dropdown.Item>
                  <Dropdown.Item eventKey="4">페이스북</Dropdown.Item>
                  <Dropdown.Item eventKey="5">링크</Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
              {
                /* <Button variant="light">인</Button>
                <Button variant="light">트</Button>
                <Button variant="light">페</Button>
                <Button variant="light">링</Button> */
              }
            </Col>
            <Col className="wishList">
              <Button variant="outline-dark">관심설정⭐</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          <div></div>
          상세페이지 (editor로 쓴 부분)
        </Col>
        <Col sm={4}>
          <Row className="rewardList">
            <ListGroup>
              {rewards.map((x) => (
                <div key={x.funding_id}>
                  <ListGroup.Item action variant="success">
                    <div>제목:{x.title}</div>
                    <div style={{ "overflow": "ellipsis" }}>
                      설명:{x.content}
                    </div>
                    <div>가격:{x.price}</div>
                    <div>현재까지펀딩수:{x.reward_current_count}</div>
                    <div>펀딩의수량:{x.reward_count}</div>
                  </ListGroup.Item>
                </div>
              ))}
            </ListGroup>
          </Row>

          <Row className="joinBtn">
            <Button variant="success">참가</Button>
          </Row>
        </Col>
      </Row>

      <Container>
        <Row md={3} xs={1}>
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

export default FundingsDetail;
