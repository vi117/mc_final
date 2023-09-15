import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import LogoSvg from "../Logo";
import SearchBar from "../SearchBar";

export function Header() {
  return (
    <header className="header_container">
      <div className="logo_container">
        <div className="page_logo">
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
            <p className="header_login_btn">
              <CgProfile
                color="#555555"
                style={{ marginRight: "5px", width: "20px", height: "20px" }}
              />
              로그인/회원가입
            </p>
          </NavLink>
        </div>
      </div>
      <div className="header_nav_container">
        <div className="left">
          <div className="nav_item">
            <RxHamburgerMenu />
          </div>
          <div className="nav_item">
            <NavLink to={"/"}>
              홈
            </NavLink>
          </div>
          <div className="nav_item">
            카테고리
          </div>
          <div className="nav_item">
            <NavLink to={"/fundings"}>
              펀딩
            </NavLink>
          </div>
          <div className="nav_item">
            <NavLink to={"/community"}>
              커뮤니티
            </NavLink>
          </div>
        </div>
        <div className="right">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
