import { Col, Container, Row } from "react-bootstrap";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes["footer_area"]}>
        <Container>
          <div className={classes["footer_container"]}>
            <Row>
              <Col xs={3} sm={3} className={classes.footer_logo}>
                <h1>해피테일즈</h1>
              </Col>
              <Col xs={0} sm={7} className={classes.footer_details}>
                <ul className={classes.footer_info}>
                  <li>해피테일즈㈜</li>
                  <li>대표이사 백재웅</li>
                  <li>사업자 등록번호 123-45-67899</li>
                  <li>통신판매업신고번호 2031-성남분당a-1234</li>
                  <li>경기 성남시 분당구 판교로 123 abc A동 456호</li>
                  <li>이메일 상담 info@happytails.kr</li>
                  <li>유선 상담 1234-4567</li>
                  <li style={{ fontWeight: "700" }}>
                    @2023 HappyTails Inc. All Rights Reserved.
                  </li>
                </ul>
                <ul>
                  <li>
                    일부 상품의 경우 해피테일즈는 통신판매중개자이며 통신판매
                    당사자가 아닙니다.
                  </li>
                  <li>
                    해당되는 상품의 경우 삼품, 상품정보, 거래에 관한 의무와
                    책임은 판매자에게 있으므로, 각 상품 페이지에서 구체적인
                    내용을 확인하시기 바랍니다.
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </footer>
  );
}
