import { useState } from "react";
import "./styles/co_detail.css";
import Commentsdata from "./assets/commentsample";
import { ReactComponent as Heart } from "./assets/Heart-Linear.svg";
import { ReactComponent as More } from "./assets/more.svg";
import Sampledata from "./assets/sampledata";
import Profileimg from "./assets/user.png";

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

  return (
    <>
      <div className="coDetailWrap">
        <div className="container">
          <div className="titleArea">
            <div className="selectedTitle">{selectedPost.title}</div>
            <div className="detailbtn">
              <button>수정</button>
              <button>삭제</button>
            </div>
          </div>
          <div className="createdArea">
            <img src={Profileimg} className="user"></img>
            <div className="createdBy">{selectedPost.createdBy}</div>

            <div className="dateArea">
              <div className="date">{createdAt}</div>
              <div className="views">조회수:{views}</div>
            </div>
          </div>
          <div className="contentArea">
            <p>{selectedPost.contents}</p>
          </div>
          <div className="reportArea">
            <button style={{ marginRight: "7px" }}>
              <Heart
                className="Hearticon"
                style={{
                  width: "24px",
                  stroke: heart.isChecked ? "#DF2E38" : "#6d6d6d",
                  fill: heart.isChecked ? "#DF2E38" : "none",
                }}
                onClick={clickHeart}
              />
            </button>
            <button>신고</button>
          </div>
          <div className="commentArea">
            <p>댓글 ({totalComments}개)</p>
            <input
              type="text"
              className="commentWrite"
              placeholder="댓글 남기기"
            />
            <div className="commentbtn">
              <button>등록</button>
              <button>비밀글 체크</button>
            </div>
            {comments.map((comment, i) => (
              <div key={i} className="oldComment">
                <div className="commentId">{comment.createdBy}</div>
                <div className="commentContents">{comment.contents}</div>
                <div className="commentDate">{comment.createdAt}</div>
                <More
                  className="morebtn"
                  style={{
                    width: "20px",
                    stroke: "#9e9e9e",
                  }}
                >
                </More>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityDetail;
