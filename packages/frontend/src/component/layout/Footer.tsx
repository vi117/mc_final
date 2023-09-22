import { Col, Container, Row } from "react-bootstrap";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <footer>
      <div>
        <Container>
          <div className={classes["footer_container"]}>
            <Row>
              <Col xs={3} className={classes.footer_logo}>
                <h1>해피테일즈 고객센터</h1>
              </Col>
              <Col className={classes.footer_details}>
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
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </footer>
  );
}
