import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import baseClasses from "../styles/Co_base.module.css";
import classes from "../styles/Co_detail.module.css";

function useToggleMenu(ref, btnRef, handler, condition) {
  useEffect(() => {
    if (ref.current && condition) {
      const node = ref.current;
      const outside = (event) => {
        if (
          !node.contains(event.target) && !btnRef.current.contains(event.target)
        ) {
          handler();
        }
      };
      document.addEventListener("click", outside, true);
      return () => {
        document.removeEventListener("click", outside, true);
      };
    }
  }, [handler, ref, btnRef, condition]);
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function CommentDetail({
  comment,
  onDeleteComment = () => {},
}) {
  const ref = useRef(null);
  const btnRef = useRef(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  useToggleMenu(ref, btnRef, () => {
    setIsMoreOpen(false);
  }, isMoreOpen);

  return (
    <div className={classes["oldComment"]}>
      <div className={classes["comment_profile"]}>
        <div className={classes["commentId"]}>{comment.nickname}</div>
        <div style={{ marginLeft: "auto", display: "flex" }}>
          <div className={classes["commentDate"]}>
            {formatDate(comment.created_at)}
          </div>
          <div className={classes["moretogglearea"]}>
            <div
              onClick={() => {
                setIsMoreOpen(!isMoreOpen);
              }}
              ref={btnRef}
            >
              <FiMoreVertical
                className={classes["morebtn"]}
                style={{
                  width: "20px",
                  stroke: "#A2A2A2",
                }}
              />
            </div>
            {isMoreOpen && (
              <ul ref={ref} className={classes["btntoggle"]}>
                <li>
                  <a>수정</a>
                </li>
                <li>
                  <a onClick={onDeleteComment}>삭제</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className={classes["commentContents"]}>
        {comment.content}
      </div>
    </div>
  );
}

export function Comments({
  comments,
  article_id,
  onRegisterComment = () => {
    return false;
  },
  onDeleteComment = () => {},
}) {
  const [content, setContent] = useState("");

  return (
    <div className={classes["commentArea"]}>
      <p>댓글 ({comments.length}개)</p>
      <input
        type="text"
        className={clsx(classes["commentWrite"], baseClasses["co_input"])}
        placeholder="댓글 남기기"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={classes["commentbtn"]}>
        <button
          onClick={async () => {
            if (await onRegisterComment(content)) {
              setContent("");
            }
          }}
        >
          등록
        </button>
        <button>비밀글 체크</button>
      </div>
      {comments.map(comment => (
        <CommentDetail
          comment={comment}
          key={comment.id}
          article_id={article_id}
          onDeleteComment={() => onDeleteComment(comment)}
        >
        </CommentDetail>
      ))}
    </div>
  );
}

export default Comments;
