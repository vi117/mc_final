import { logout } from "@/api/user";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useLoginId, useLoginInfo } from "../../hook/useLogin";
import Profileimg from "../../pages/community/assets/user.png";
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
            className={classes.login_svg}
          />
          <span className={classes.login_text}>로그아웃</span>
        </span>
      </NavLink>
    )
    : (
      <NavLink to={"/login"}>
        <span className={classes.header_login_btn}>
          <FiLogIn
            className={classes.login_svg}
          />
          <span className={classes.login_text}>로그인</span>
        </span>
      </NavLink>
    );
}

export function Header() {
  const userInfo = useLoginInfo();

  return (
    <>
      <div className={classes.header_container}>
        <Container as={"header"} className={classes.header_area}>
          <Navbar expand="sm" className={classes.header_navbar}>
            <Container className={classes.header_brandcontainer}>
              <NavLink to={"/"}>
                <Navbar.Brand>
                  <LogoSvg
                    style={{ width: "180px", height: "30px" }}
                  >
                  </LogoSvg>
                </Navbar.Brand>
              </NavLink>
              {
                /* <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className={classes.sb}
            >
              <BiMenu className={classes.sb_icon}></BiMenu>
            </Navbar.Toggle> */
              }
              <Navbar.Brand style={{ display: "flex" }}>
                <Nav>
                  <span className={classes.header_logo_nav}>
                    <LoginButton></LoginButton>
                  </span>
                </Nav>

                {userInfo !== null && (
                  <Nav>
                    <NavLink to={`/profile`}>
                      <span className={classes.header_logo_nav}>
                        <img
                          src={userInfo.profile_image ?? Profileimg}
                          className={classes.user}
                          alt="Profile"
                        />
                        <span className={classes.user_nickname}>
                          {userInfo.nickname}
                        </span>
                      </span>
                    </NavLink>
                  </Nav>
                )}
              </Navbar.Brand>
            </Container>
          </Navbar>
          <Navbar
            bg="transparent"
            data-bs-theme="light"
            className={classes.header_nav_container}
          >
            <Nav variant="underline" className={classes.header_nav_underline}>
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
      </div>
    </>
  );
}

export default Header;
