import { Container, Nav, Navbar } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { loginRevalidate, useLogin } from "../../hook/useLogin";
import LogoSvg from "../Logo";
import SearchModal from "../SearchModal";
import classes from "./Header.module.css";
// import SearchBar from "../SearchBar";
// import SearchBox from "../SearchBox";

/**
 * Logs the user out by making a POST request to the "/api/v1/users/logout" endpoint.
 *
 * @return {Promise<void>} Returns a promise that resolves when the logout request is complete.
 */
async function logout(): Promise<void> {
  const res = await fetch("/api/v1/users/logout", {
    method: "POST",
  });
  if (res.status !== 200) {
    console.log("logout fail");
  }
  loginRevalidate();
  console.log("logout success");
}

function LoginButton() {
  const userId = useLogin();
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
  const userId = useLogin();
  console.log(userId);

  return (
    <>
      <header className={classes.header_container}>
        <Navbar expand="sm">
          <Container className="header-brand-container">
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
              {userId !== null && (
                <Nav>
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
                        내정보
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
              <Nav.Link href="/">홈</Nav.Link>
              <Nav.Link href="">카테고리</Nav.Link>
              <Nav.Link href="/fundings">펀딩</Nav.Link>
              <Nav.Link href="/community">커뮤니티</Nav.Link>
            </div>
            <div className={classes.right}>
              <SearchModal />
            </div>
          </Nav>
        </Navbar>
      </header>
    </>
  );
}

export default Header;
