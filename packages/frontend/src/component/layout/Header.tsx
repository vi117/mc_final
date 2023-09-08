import { Button } from "react-bootstrap";
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
        <div className="user_edit">
          <Button variant="outline-primary">Sign In/Up</Button>
        </div>
      </div>
      <div className="header_nav_container">
        <div className="left">
          <div className="nav_item">
            icon
            {/* TODO(vi117): Hamburger icon 삽입  */}
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
