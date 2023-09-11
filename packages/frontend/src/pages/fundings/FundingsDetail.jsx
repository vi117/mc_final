import { Button, Container, ListGroup } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

const FundingsDetail = function() {
  // const customButtonStyle = { // 을 컨셉색깔로 바꾸려고 해봤는데 실패
  //   backgroundColor: '#00917C' , // 원하는 색상
  //   color: 'white' // 텍스트 색상
  // };

  return (
    <Container style={{ border: "1px solid red" }}>
      <Row>
        펀딩 제목
      </Row>

      <Row>
        <Col xs={6} md={4}>
          썸네일
        </Col>
        <Col xs={6} md={4}>
          <Row>개설기간, 달성도(후원자 명수)</Row>
          <Row>펀딩 창작자 소개</Row>
          <Row>
            <Col>SNS 공유</Col>
            <Col>관심 설정</Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col xs={6} md={4}>
          상세페이지
        </Col>
        <Col xs={6} md={4}>
          <Row>
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

          <Row>
            <Button variant="success">참가버튼</Button>
          </Row>
        </Col>
      </Row>

      <Row>
        비슷한 토픽의 펀딩
      </Row>
    </Container>
  );
};

export default FundingsDetail;
