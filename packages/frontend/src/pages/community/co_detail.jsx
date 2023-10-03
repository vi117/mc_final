import { AiFillHeart } from "react-icons/ai";
import { Link, NavLink } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import useArticleDetail from "../../hook/useArticleDetail";
import { useLoginId } from "../../hook/useLogin";
import Profileimg from "./assets/user.png";
import Comments from "./components/comments";
import classes from "./styles/Co_detail.module.css";

export function CommunityDetail() {
  const user_id = useLoginId();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
    mutate,
  } = useArticleDetail(id, {
    with_comments: true,
  });

  if (fetcherIsLoading) {
    return <div>로딩중...</div>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }
  const item = fetcherData;

  const liked = user_id === item.like_user_id;
  return (
    <div className={classes["coDetailWrap"]}>
      <div className={classes["container"]}>
        <div className={classes["titleArea"]}>
          <div className={classes["selectedTitle"]}>{item.title}</div>
          <div className={classes["detailbtn"]}>
            <Link to={`/community/${item.id}/edit`}>
              <button className={classes["editbtn"]}>수정</button>
            </Link>
            <button onClick={deleteArticle}>삭제</button>
          </div>
        </div>
        <div className={classes["createdArea"]}>
          <NavLink
            to={`/host-profile/${item.author_id}`}
            className={classes["linkto"]}
          >
            <img src={Profileimg} className={classes["user"]} alt="Profile" />
            <div className={classes["createdBy"]}>{item.author_nickname}</div>
          </NavLink>
          <div className={classes["dateArea"]}>
            <div className={classes["date"]}>{item.created_at}</div>
            <div className={classes["views"]}>조회수:{item.view_count}</div>
          </div>
        </div>
        {item.related_funding_id && (
          <Link
            to={`/fundings/${item.related_funding_id}`}
            className={classes["related_funding_linkto"]}
          >
            펀딩 | {`${item.related_funding.title}`}
          </Link>
        )}
        <div className={classes["contentArea"]}>
          <p
            // TODO(vi117): sanitize content
            dangerouslySetInnerHTML={{
              __html: item.content,
            }}
          >
          </p>
        </div>
        <div className={classes["reportArea"]}>
          <button
            style={{ marginRight: "7px" }}
            onClick={() => {
              setLike(!liked);
            }}
          >
            <AiFillHeart
              className={classes["Hearticon"]}
              style={{
                width: "24px",
                height: "24px",
                stroke: liked ? "#DF2E38" : "#6d6d6d",
                fill: liked ? "#DF2E38" : "#6d6d6d",
              }}
            />
          </button>
          <button className={classes["reportbtn"]}>신고</button>
        </div>
        <Comments
          comments={item.comments}
          onRegisterComment={registerComment}
          article_id={id}
          onDeleteComment={deleteComment}
        >
        </Comments>
      </div>
    </div>
  );
  async function deleteArticle() {
    if (confirm("정말로 삭제하시겠습니까?") == true) {
      const url = new URL(`/api/v1/articles/${id}`, window.location.origin);

      const res = await fetch(url.href, {
        method: "DELETE",
      });
      if (res.status == 200) {
        alert("삭제이 완료되었습니다.");
        navigate("/community");
        return;
      }
      alert("삭제되었습니다"); // 삭제 기능 나중에 구현
    } else {
      return false;
    }
  }
  async function registerComment(c) {
    const url = new URL(
      `/api/v1/articles/${id}/comments`,
      window.location.origin,
    );
    if (user_id == null) {
      alert("비회원은 권한이 없습니다. 로그인 해주세요.");
      location.href = "/login";
      return;
    }
    const res = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: c,
      }),
    });
    const resJson = await res.json();
    if (res.status == 201) {
      mutate({
        ...item,
        comments: [...item.comments, {
          content: c,
          created_at: new Date().toISOString(),
          user_id,
          id: resJson.inserted_id,
        }],
      });
      return true;
    }
    return false;
  }

  async function deleteComment(comment) {
    const url = new URL(
      `/api/v1/articles/${id}/comments/${comment.id}`,
      window.location.origin,
    );
    const res = await fetch(url.href, {
      method: "DELETE",
    });
    if (res.status == 200) {
      mutate({
        ...item,
        comments: item.comments.filter((c) => c.id !== comment.id),
      });
      console.log("삭제되었습니다.");
    }
  }

  async function setLike(like = true) {
    if (user_id == null) {
      alert("비회원은 권한이 없습니다. 로그인 해주세요.");
      location.href = "/login";
      return;
    }
    const url = new URL(`/api/v1/articles/${id}/like`, window.location.origin);

    if (!like) {
      url.searchParams.append("unlike", "true");
    }
    const res = await fetch(url.href, {
      method: "POST",
    });
    if (res.status == 200) {
      mutate({
        ...item,
        like_user_id: like ? user_id : null,
      });
    }
  }
}

export default CommunityDetail;
