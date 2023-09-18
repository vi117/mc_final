import clsx from "clsx";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import Commentsdata from "./assets/commentsample";
import Sampledata from "./assets/sampledata";
import Profileimg from "./assets/user.png";
import baseClasses from "./styles/Co_base.module.css";
import classes from "./styles/Co_detail.module.css";

export function CommunityDetail() {
  const selectedPostIndex = 0;
  const selectedPost = Sampledata[selectedPostIndex];
  const views = "0";
  const createdAt = "2023-09-14";

  const [heart, setHeart] = useState({
    ischecked: false,
    notice: "",
  });

  const clickHeart = () => {
    setHeart((prevHeart) => ({
      ...prevHeart,
      isChecked: !prevHeart.isChecked,
    }));
  };

  const [comments] = useState(Commentsdata);

  const totalComments = Commentsdata.length;

  const [isMoreOpen, setIsMoreOpen] = useState(
    Array(comments.length).fill(false),
  );

  const toggleMore = (index) => {
    const updatedIsMoreOpen = [...isMoreOpen];
    updatedIsMoreOpen[index] = !updatedIsMoreOpen[index];
    setIsMoreOpen(updatedIsMoreOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const moreButtons = document.querySelectorAll(`.${classes["morebtn"]}`);
      if (
        !Array.from(moreButtons).some((button) => button.contains(e.target))
      ) {
        setIsMoreOpen(Array(comments.length).fill(false));
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [comments]);

  const deleteMessage = () => {
    if (confirm("정말로 삭제하시겠습니까?") == true) {
      alert("삭제되었습니다"); // 삭제 기능 나중에 구현
    } else {
      return false;
    }
  };

  return (
    <div className={classes["coDetailWrap"]}>
      <div className={classes["container"]}>
        <div className={classes["titleArea"]}>
          <div className={classes["selectedTitle"]}>{selectedPost.title}</div>
          <div className={classes["detailbtn"]}>
            <button>수정</button>
            <button onClick={deleteMessage}>삭제</button>
          </div>
        </div>
        <div className={classes["createdArea"]}>
          <img src={Profileimg} className={classes["user"]} alt="Profile" />
          <div className={classes["createdBy"]}>{selectedPost.createdBy}</div>
          <div className={classes["dateArea"]}>
            <div className={classes["date"]}>{createdAt}</div>
            <div className={classes["views"]}>조회수:{views}</div>
          </div>
        </div>
        <div className={classes["contentArea"]}>
          <p>{selectedPost.contents}</p>
        </div>
        <div className={classes["reportArea"]}>
          <button style={{ marginRight: "7px" }}>
            <AiFillHeart
              className={classes["Hearticon"]}
              style={{
                width: "24px",
                stroke: heart.isChecked ? "#DF2E38" : "#6d6d6d",
                fill: heart.isChecked ? "#DF2E38" : "none",
              }}
              onClick={clickHeart}
            />
          </button>
          <button className={classes["reportbtn"]}>신고</button>
        </div>
        <div className={classes["commentArea"]}>
          <p>댓글 ({totalComments}개)</p>
          <input
            type="text"
            className={clsx(classes["commentWrite"], baseClasses["co_input"])}
            placeholder="댓글 남기기"
          />
          <div className={classes["commentbtn"]}>
            <button>등록</button>
            <button>비밀글 체크</button>
          </div>
          {comments.map((comment, i) => (
            <div key={i} className={classes["oldComment"]}>
              <div className={classes["commentId"]}>{comment.createdBy}</div>
              <div className={classes["commentContents"]}>
                {comment.contents}
              </div>
              <div className={classes["commentDate"]}>{comment.createdAt}</div>
              <div className={classes["moretogglearea"]}>
                <FiMoreVertical
                  className={classes["morebtn"]}
                  style={{
                    width: "20px",
                    stroke: "#9e9e9e",
                  }}
                  onClick={() =>
                    toggleMore(i)}
                />
                {isMoreOpen[i] && (
                  <ul className={classes["btntoggle"]}>
                    <li>
                      <a href="/id:edit">수정</a>
                    </li>
                    <li>
                      <a href="/id:delete" onClick={deleteMessage}>삭제</a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityDetail;
