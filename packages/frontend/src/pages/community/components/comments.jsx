import clsx from "clsx";
import { useEffect, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import Commentsdata from "../assets/commentsample";
import baseClasses from "../styles/Co_base.module.css";
import classes from "../styles/Co_detail.module.css";

export function Comments() {
  const [comments] = useState(Commentsdata);
  const [isMoreOpen, setIsMoreOpen] = useState(
    Array(comments.length).fill(false),
  );
  const totalComments = Commentsdata.length;
  const toggleMore = (index) => {
    const updatedIsMoreOpen = [...isMoreOpen];
    updatedIsMoreOpen[index] = !updatedIsMoreOpen[index];
    setIsMoreOpen(updatedIsMoreOpen);
  };

  const deleteMessage = () => {
    if (confirm("정말로 삭제하시겠습니까?") == true) {
      alert("삭제되었습니다"); // 삭제 기능 나중에 구현
    } else {
      return false;
    }
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

  return (
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
  );
}

export default Comments;
