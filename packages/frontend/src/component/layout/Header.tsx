import { Container, Nav, Navbar } from "react-bootstrap";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { loginRevalidate, useLoginId, useLoginInfo } from "../../hook/useLogin";
import Profileimg from "../../pages/community/assets/user.png";
import LogoSvg from "../Logo";
import SearchModal from "../SearchModal";
import classes from "./Header.module.css";
// import SearchBar from "../SearchBar";
// import SearchBox from "../SearchBox";
// import AutoSearch from "../AutoSearch";

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
  const userId = useLoginId();
  const userInfo = useLoginInfo();

  console.log(userId);

  return (
    <>
      <Container as={"header"} className={classes.header_container}>
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

              {userId !== null && (
                // TODO: 유저닉네임 노출
                <Nav>
                  {
                    /* <div
                    style={{
                      alignItems:"center",
                      display:"flex",
                      fontFamily: "Noto Sans KR, sans-serif",
                    }}
                  >
                    {userInfo.nickname}
                  </div> */
                  }

                  <NavLink to={`/profile`}>
                    <span className={classes.header_logo_nav}>
                      <img
                        src={userInfo.profile_image ?? Profileimg}
                        className={classes.user}
                        alt="Profile"
                      />
                      {
                        /* <CgProfile
                        color="#555555"
                        style={{
                          marginRight: "5px",
                          width: "20px",
                          height: "20px",
                        }}
                      /> */
                      }
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
