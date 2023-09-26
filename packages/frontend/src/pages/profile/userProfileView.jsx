import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Profileimg from "../community/assets/user.png";
import classes from "./UserProfileView.module.css";

const UserProfileView = function() {
  return (
    <>
      <div className={classes["funding_container"]}>
        <img src={Profileimg} className={classes["user"]} />
        <span>닉네임</span>
        <span>소개글</span>
        <Navbar bg="transparent" data-bs-theme="light">
          <Nav>
            <NavLink to={"/userfundings"}>열린 펀딩</NavLink>
            <NavLink to={"#"}>닫힌 펀딩</NavLink>
            <NavLink to={"##"}>#후기</NavLink>
          </Nav>
        </Navbar>
        <hr />
      </div>
    </>
  );
};

export default UserProfileView;
