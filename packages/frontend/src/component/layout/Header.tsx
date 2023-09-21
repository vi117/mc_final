import { CgProfile } from "react-icons/cg";

import { FiLogIn, FiLogOut } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { loginRevalidate, useLogin } from "../../hook/useLogin";
import LogoSvg from "../Logo";
import SearchBar from "../SearchBar";
import classes from "./Header.module.css";

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
      <NavLink to={"#"} onClick={logout}>
        <p className={classes.header_login_btn}>
          <FiLogOut
            color="#555555"
            style={{
              marginRight: "5px",
              width: "20px",
              height: "20px",
            }}
          />
          로그아웃
        </p>
      </NavLink>
    )
    : (
      <NavLink to={"/login"}>
        <p className={classes.header_login_btn}>
          <FiLogIn
            color="#555555"
            style={{
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
    <header className={classes.header_container}>
      <div className={classes.logo_container}>
        <div className={classes.page_logo}>
          <LogoSvg
            style={{
              width: "240px",
              height: "30px",
            }}
            viewBox="0 0 975 115"
          />
        </div>
        <div className={classes.page_profile_container}>
          <LoginButton></LoginButton>
          {userId !== null && (
            <>
              <NavLink to={`/profile`}>
                <span>
                  <CgProfile
                    color="#555555"
                    style={{
                      marginRight: "5px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  내 정보
                </span>
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div className={classes.header_nav_container}>
        <div className={classes.left}>
          <div className={classes.nav_item}>
            <RxHamburgerMenu />
          </div>
          <div className={classes.nav_item}>
            <NavLink to={"/"}>
              홈
            </NavLink>
          </div>
          <div className={classes.nav_item}>
            카테고리
          </div>
          <div className={classes.nav_item}>
            <NavLink to={"/fundings"}>
              펀딩
            </NavLink>
          </div>
          <div className={classes.nav_item}>
            <NavLink to={"/community"}>
              커뮤니티
            </NavLink>
          </div>
        </div>
        <div className={classes.right}>
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
