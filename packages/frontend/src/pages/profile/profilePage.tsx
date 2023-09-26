import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLoginInfo } from "../../hook/useLogin";
import AccordionList from "./profileLikeList";

export default function Profile() {
  const userInfo = useLoginInfo();

  if (!userInfo) {
    // Todo: 로그인이 안된경우 fallback
    return <div>로그인이 필요합니다.</div>;
  }
  // Todo:
  //   api 연결 후 닉네임 집어넣기
  //   내가 만든 펀딩 및 후원 펀딩 리스트 연결하기
  return (
    <Container
      className="my-5"
      style={{ maxWidth: "var(--max-content-width)" }}
    >
      <Row>
        <Col md={3} className="my-3">
          <Row>
            <span>{userInfo.nickname}</span>
          </Row>
          <hr></hr>
          <Row>
            <Link to={`/profile/edit`}>
              내정보 수정
            </Link>
          </Row>
          <Row>
            <Link to={`/reset-password`}>
              비밀번호 재설정
            </Link>
          </Row>
          <Row>
            <Link to={`/withdraw`}>
              회원탈퇴
            </Link>
          </Row>
          {userInfo.is_admin && (
            <Row>
              <Link to={`/admin`}>
                Admin
              </Link>
            </Row>
          )}
        </Col>
        <Col md={9}>
          <AccordionList />
        </Col>
      </Row>
    </Container>
  );
}
