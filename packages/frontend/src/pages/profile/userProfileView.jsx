import { Nav, Navbar } from "react-bootstrap";
import Profileimg from "../community/assets/user.png";
import classes from "./UserProfileView.module.css";

const UserProfileView = function() {
  return (
    <>
      <div className={classes["funding_container"]}>
        <div style={{ display: "flex" }}>
          <img src={Profileimg} className={classes["user"]} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className={classes["host_nickname"]}>닉네임</span>
            <span>소개글</span>
          </div>
        </div>
        <div>
          <Navbar bg="transparent" data-bs-theme="light">
            <Nav variant="underline">
              <Nav.Link href="/userview/opendfundings">열린 펀딩</Nav.Link>
              <Nav.Link href="#">#닫힌 펀딩</Nav.Link>
              <Nav.Link href="##">#펀딩 후기</Nav.Link>
            </Nav>
          </Navbar>
        </div>
        <hr />
      </div>
    </>
  );
};

export default UserProfileView;
