import "./styles/co_detail.css";
import Sampledata from "./assets/sampledata";

export function CommunityDetail() {
  const selectedPostIndex = 0;
  const selectedPost = Sampledata[selectedPostIndex];
  const views = "0";
  const createdAt = "2023-09-14";

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
            <img className="user" src="./assets/user.png"></img>
            <div className="createdBy">{selectedPost.createdBy}</div>

            <div className="dateArea">
              <div className="date">{createdAt}</div>
              <div className="views">조회수:{views}</div>
            </div>
          </div>
          <div className="content">
            <p>{selectedPost.contents}</p>
          </div>
          <div className="reportArea">
            <button>좋아요</button>
            <button>신고</button>
          </div>
          <div className="comment">
            <input type="text" placeholder="댓글 작성" />
            <button>댓글 작성</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityDetail;
