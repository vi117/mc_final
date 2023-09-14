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

const placeholder = "https://via.placeholder.com/850x375";

const FundingsDetail = function() {
  return (
    <Container style={{ "padding-top": "20px", "width": "50vw" }}>
      <div className="sujung">
        <Button variant="success">수정</Button>
      </div>
      <Row>
        <Col sm={8} className="fundingName">
          <h1>펀딩 제목</h1>
        </Col>

        <Col className="tags">
          <div>
            <Badge>tag1</Badge>
            <Badge>tag2</Badge>
          </div>
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
            <div></div>개설기간, 달성도(후원자 명수)
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
          상세페이지
        </Col>
        <Col sm={4}>
          <Row className="rewardList">
            <ListGroup>
              <ListGroup.Item action variant="success">
                리워드제품1<br />
                제품설명1
              </ListGroup.Item>
              <ListGroup.Item action variant="success">
                리워드제품2<br />
                제품설명2
              </ListGroup.Item>
              <ListGroup.Item action variant="success">
                리워드제품3<br />
                제품설명3
              </ListGroup.Item>
              <ListGroup.Item action variant="success">
                리워드제품4<br />
                제품설명4
              </ListGroup.Item>
              <ListGroup.Item action variant="success">
                리워드제품5<br />
                제품설명5
              </ListGroup.Item>
              <ListGroup.Item action variant="success">
                리워드제품6<br />
                제품설명6
              </ListGroup.Item>
              <ListGroup.Item action variant="success">
                리워드제품7<br />
                제품설명7
              </ListGroup.Item>
            </ListGroup>
          </Row>

          <Row className="joinBtn">
            <Button variant="success">참가</Button>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col>
          <div></div>비슷한 토픽의 펀딩1
        </Col>
        <Col>
          <div></div>비슷한 토픽의 펀딩2
        </Col>
        <Col>
          <div></div>비슷한 토픽의 펀딩3
        </Col>
      </Row>
    </Container>
  );
};

export default FundingsDetail;
