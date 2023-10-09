import { Col, Row } from "react-bootstrap";

import { Container } from "@/component/Container";
import { GoChevronRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLoginInfo } from "../../hook/useLogin";
import Profileimg from "../community/assets/user.png";
import AccordionList from "./profileLikeList";
import classes from "./profilePage.module.css";

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
    <>
      <div
        style={{
          backgroundColor: "var(--border)",
          paddingTop: "30px",
          marginTop: "-30px",
          marginBottom: "-20px",
        }}
      >
        <Container
          style={{ minHeight: "650px" }}
        >
          <Row>
            <Col md={3} className={classes["my-3"]}>
              <div
                style={{
                  border: "1px solid var(--secondary)",
                  backgroundColor: "var(--white)",
                }}
              >
                <div className={classes["profile_area"]}>
                  <div className={classes["profile_background"]}></div>
                  <Row className={classes["profile_container"]}>
                    <span>
                      <img
                        src={Profileimg}
                        className={classes["user"]}
                        alt="Profile"
                      />
                    </span>
                    <span className={classes["user_profile"]}>
                      <b>{userInfo.nickname}</b> 님{" "}
                      <NavLink to={`/host-profile/${userInfo.id}`}>
                        <GoChevronRight />
                      </NavLink>
                    </span>
                  </Row>
                </div>
                <hr className={classes["hr"]}></hr>
                <Row>
                  <Link to={`/profile/edit`}>
                    <p>내정보 수정</p>
                  </Link>
                </Row>
                <Row>
                  <Link to={`/reset-password`}>
                    <p>비밀번호 재설정</p>
                  </Link>
                </Row>
                {userInfo.is_admin && (
                  <Row>
                    <Link to={`/admin`}>
                      <p>펀딩 관리</p>
                    </Link>
                  </Row>
                )}
                <Row>
                  <Link to={`/withdraw`}>
                    <p>회원탈퇴</p>
                  </Link>
                </Row>
                <hr className="d-block d-md-none" />
              </div>
            </Col>
            <Col md={9} className={classes["accordion"]}>
              <AccordionList />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
