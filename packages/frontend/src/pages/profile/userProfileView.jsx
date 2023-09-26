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
        <div
          style={{ fontSize: "24px", fontWeight: "700" }}
          className={classes["title"]}
        >
          펀딩 리스트
        </div>
        <div>펀딩목록</div>
        <hr />
      </div>
    </>
  );
};

export default UserProfileView;
