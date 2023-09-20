import { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Profileimg from "./assets/user.png";
import Comments from "./components/comments";
import classes from "./styles/Co_detail.module.css";

export function CommunityDetail() {
  const [heart, setHeart] = useState({
    ischecked: false,
    notice: "",
  });
  const { id } = useParams();
  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useSWR(
    `/api/v1/articles/${id}`,
    (url) => fetch(url).then((res) => res.json()),
  );
  if (fetcherIsLoading) {
    return <div>로딩중...</div>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }
  const item = fetcherData;
  const clickHeart = () => {
    setHeart((prevHeart) => ({
      ...prevHeart,
      isChecked: !prevHeart.isChecked,
    }));
  };

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
          <div className={classes["selectedTitle"]}>{item.title}</div>
          <div className={classes["detailbtn"]}>
            <Link to={`/community/${item.id}/edit`}>
              <button className={classes["editbtn"]}>수정</button>
            </Link>
            <button onClick={deleteMessage}>삭제</button>
          </div>
        </div>
        <div className={classes["createdArea"]}>
          <img src={Profileimg} className={classes["user"]} alt="Profile" />
          <div className={classes["createdBy"]}>{item.author_nickname}</div>
          <div className={classes["dateArea"]}>
            <div className={classes["date"]}>{item.created_at}</div>
            <div className={classes["views"]}>조회수:{item.view_count}</div>
          </div>
        </div>
        <div className={classes["contentArea"]}>
          <p>{item.content}</p>
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
        <Comments></Comments>
      </div>
    </div>
  );
}

export default CommunityDetail;
