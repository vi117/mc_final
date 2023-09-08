import { Button } from "react-bootstrap";
import LogoSvg from "../Logo";
import SearchBar from "../SearchBar";
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";

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
          <p
            className="header_login_btn"
          >
            <CgProfile color="#555555" style={{ marginRight: "5px", width: "20px", height: "20px"}} />
            로그인/회원가입
          </p>
        </div>
      </div>
      <div className="header_nav_container">
        <div className="left">
          <div className="nav_item">
            <RxHamburgerMenu />
          </div>
          <div className="nav_item">
            홈
          </div>
          <div className="nav_item">
            카테고리
          </div>
          <div className="nav_item">
            펀딩
          </div>
          <div className="nav_item">
            커뮤니티
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
