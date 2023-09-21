import { Col, Container, Row } from "react-bootstrap";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <footer>
      <Container>
        <Row xs={1} md={2}>
          <Col md={4} className={classes.footer_logo}>
            해피테일즈 고객센터
          </Col>
          <Col md={6} className={classes.footer_details}>
            <p>
              해피테리즈 대표이사 백재웅 사업자 등록번호 123-45-67899 성남시
              분당구 동판교로 115
            </p>
            <p>
              이메일 상담 info@happytails.kr
            </p>
            <p>
              @2021 HappyTails Inc. All Rights Reserved.
            </p>
            <p>
              일부 상품의 경우 해피테일즈는 통신판매중개자이며 통신판매 당사자가
              아닙니다.
            </p>
            <br></br>
            <p>
              해당되는 상품의 경우 삼품, 상품정보, 거래에 관한 의무와 책임은
              판매자에게 있으므로, 각 상품 페이지에서 구체적인 내용을 확인하시기
              바랍니다.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
