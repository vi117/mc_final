import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import LogoSvg from "../Logo";
import SearchBar from "../SearchBar";
import classes from "./Header.module.css";

export function Header() {
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
        <div className="">
          <NavLink to={"/login"}>
            <p className={classes.header_login_btn}>
              <CgProfile
                color="#555555"
                style={{ marginRight: "5px", width: "20px", height: "20px" }}
              />
              로그인
            </p>
          </NavLink>
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
