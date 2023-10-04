import { logout } from "@/api/user";
import { Container, Nav, Navbar } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useLoginId, useLoginInfo } from "../../hook/useLogin";
import LogoSvg from "../Logo";
import SearchModal from "../SearchModal";
import classes from "./Header.module.css";
// import SearchBar from "../SearchBar";
// import SearchBox from "../SearchBox";
// import AutoSearch from "../AutoSearch";

function LoginButton() {
  const userId = useLoginId();
  return userId !== null
    ? (
      <NavLink to={"/"} onClick={logout}>
        <span className={classes.header_login_btn}>
          <FiLogOut
            color="#555555"
            style={{
              marginRight: "5px",
              width: "20px",
              height: "20px",
            }}
          />
          로그아웃
        </span>
      </NavLink>
    )
    : (
      <NavLink to={"/login"}>
        <p className={classes.header_login_btn}>
          <FiLogIn
            color="#6d6d6d"
            style={{
              color: "#6d6d6d",
              marginRight: "5px",
              width: "20px",
              height: "20px",
            }}
          />
          로그인
        </p>
      </NavLink>
    );
}

export function Header() {
  const userInfo = useLoginInfo();

  return (
    <>
      <Container as={"header"} className={classes.header_container}>
        <Navbar expand="sm" className={classes.header_navbar}>
          <Container className={classes.header_brandcontainer}>
            <NavLink to={"/"}>
              <Navbar.Brand>
                <LogoSvg
                  style={{ width: "240px", height: "30px" }}
                >
                </LogoSvg>
              </Navbar.Brand>
            </NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end gap-3 ">
              <Nav>
                <span className={classes.header_logo_nav}>
                  <LoginButton></LoginButton>
                </span>
              </Nav>

              {userInfo !== null && (
                // TODO: 유저닉네임 노출
                <Nav>
                  <nav
                    style={{
                      marginTop: "6px",
                      fontFamily: "Noto Sans KR, sans-serif",
                    }}
                  >
                    {userInfo.nickname}
                  </nav>
                  <NavLink to={`/profile`}>
                    <span className={classes.header_logo_nav}>
                      <CgProfile
                        color="#555555"
                        style={{
                          marginRight: "5px",
                          width: "20px",
                          height: "20px",
                          marginLeft: "10px",
                        }}
                      />
                      <span style={{ fontSize: "12px" }}>
                        내 정보
                      </span>
                    </span>
                  </NavLink>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Navbar bg="transparent" data-bs-theme="light">
          <Nav variant="underline" className={classes.header_nav_container}>
            <div className={classes.left}>
              <NavLink
                className={"nav-link"}
                to={"/"}
                style={{ paddingLeft: "0px" }}
              >
                홈
              </NavLink>
              <NavLink className={"nav-link"} to={"/fundings"}>펀딩</NavLink>
              <NavLink className={"nav-link"} to={"/community"}>
                커뮤니티
              </NavLink>
            </div>{" "}
            <div className={classes.right}>
              <SearchModal />
              {/* <AutoSearch/> */}
            </div>
          </Nav>
        </Navbar>
      </Container>
    </>
  );
}

export default Header;
