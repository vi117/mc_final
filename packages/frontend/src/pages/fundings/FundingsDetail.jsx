import { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Carousel,
  Dropdown,
  DropdownButton,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import useFundingDetail from "../../hook/useFundingDetail";
// import { useLoginId } from "../../hook/useLogin";
import Profileimg from "../community/assets/user.png";
import classes from "./FundingsDetail.module.css";
import "./funding_btn.css";
import { BiBookmark, BiShareAlt, BiSolidBookmark } from "react-icons/bi";
import { GoChevronRight, GoShield } from "react-icons/go";

const FundingsDetail = function() {
  const [isMoreView, setIsMoreView] = useState(false);
  const { id } = useParams();
  const { data: funding, error, isLoading, mutate } = useFundingDetail(id);
  const JoinBtnRef = useRef(null);
  const onClickImageMoreViewButton = () => {
    setIsMoreView(!isMoreView);
  };
  // const user_id = useLoginId();
  const [selectedReward, setSelectedReward] = useState(null);
  useEffect(() => {
    if (isLoading) return;
    if (error) return;
    if (funding.participated_reward_id === null) return;
    const reward = funding.rewards.filter((r) =>
      r.id === funding.participated_reward_id
    )[0];
    setSelectedReward(reward);
  }, [isLoading, error, funding?.participated_reward_id, funding?.rewards]);

  if (isLoading) {
    // TODO(vi117): sippner 대신 Bootstrap.Placeholder 띄우기.
    return <Spinner />;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  const restTime = new Date(funding.end_date).getTime() - new Date().getTime();

  const content_thumbnails = funding.content_thumbnails.length > 0
    ? funding.content_thumbnails
    : [funding.thumbnail];

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  function addDaysToEndDate(dateString, daysToAdd) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  const handleJoinBtnClick = () => {
    if (JoinBtnRef.current) {
      JoinBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const wrapImages = (html) => {
    const imgRegex = /<img(.*?)>/g;
    return html.replace(
      imgRegex,
      "<div class=\"image-container\"><img$1></div>",
    );
  };

  const content = funding.content;
  const wrappedContent = wrapImages(content);

  return (
    <div className={classes["funding_detail_container"]}>
      {
        /* <div className={classes.sujung}>
        {user_id === funding.host_id && (
          <NavLink to={`/fundings/${id}/edit`}>
            <Button variant="success">수정</Button>
          </NavLink>
        )}
      </div> */
      }

      <div className={classes["funding_title"]}>
        <ul className={classes["funding_detail_tags"]}>
          {funding.tags.map((tag) => <li key={tag.id}>{tag.tag}</li>)}
        </ul>
        <h1>{funding.title}</h1>
      </div>

      <div className={classes["funding_detail_profilearea"]}>
        <Carousel
          fade
          className={classes["funding_thumbnail_carousel"]}
          controls={false}
          indicators={false}
        >
          {content_thumbnails.map((thumbnail) => (
            <Carousel.Item key={thumbnail}>
              <img
                src={thumbnail}
                className={classes["carousel_thumbnail"]}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div className={classes["funding_detail_description"]}>
          <div className={classes.date_value_area}>
            <div className={classes["funding_detail_enddate"]}>
              <h4 className={classes["funding_profile_h4"]}>남은 기간</h4>
              <span className={classes["funding_profile_text"]}>
                {restTime / (1000 * 60 * 60 * 24) > 0
                  ? (
                    <>
                      {(restTime / (1000 * 60 * 60 * 24)).toFixed(0)}
                      <span className={classes["funding_profile_small"]}>
                        일
                      </span>
                    </>
                  )
                  : <>종료</>}
              </span>
            </div>

            <div className={classes["funding_detail_value"]}>
              <h4 className={classes["funding_profile_h4"]}>모인 금액</h4>

              <>
                <span className={classes["funding_profile_text"]}>
                  {funding.current_value.toLocaleString()}
                </span>
                <span className={classes["funding_profile_small"]}>
                  원
                </span>
              </>

              <span className={classes.funding_current_value}>
                {(funding.current_value / funding.target_value * 100).toFixed(
                  1,
                )}% 달성
              </span>
            </div>
          </div>
          <hr></hr>
          <table className={classes["funding_profile_table"]}>
            <tbody>
              <tr>
                <td className={classes["funding_table_bold"]}>목표금액</td>
                <td>{funding.target_value.toLocaleString()}원</td>
              </tr>
              <tr>
                <td className={classes["funding_table_bold"]}>펀딩기간</td>
                <td>
                  {formatDate(funding.begin_date)} ~{" "}
                  {formatDate(funding.end_date)}
                </td>
              </tr>
              <tr>
                <td className={classes["funding_table_bold"]}>결제</td>
                <td>
                  목표금액 달성 시 {addDaysToEndDate(funding.end_date, 1)}{" "}
                  에 결제 진행
                </td>
              </tr>
            </tbody>
          </table>

          <div className={classes["funding_btn_area"]}>
            <DropdownButton
              as={ButtonGroup}
              title={
                <BiShareAlt
                  className={classes["btn_svg"]}
                />
              }
              id="bg-vertical-dropdown-1"
              className={classes.funding_btn}
            >
              <Dropdown.Item eventKey="1">인스타</Dropdown.Item>
              <Dropdown.Item eventKey="2">네이버블로그</Dropdown.Item>
              <Dropdown.Item eventKey="3">트위터X</Dropdown.Item>
              <Dropdown.Item eventKey="4">페이스북</Dropdown.Item>
              <Dropdown.Item eventKey="5">링크</Dropdown.Item>
            </DropdownButton>

            <InterestButton
              funding={funding}
              setInterest={setInterest}
            />

            <Button
              className={classes["go_funding_btn"]}
              onClick={handleJoinBtnClick}
            >
              펀딩 참여하기
            </Button>
          </div>

          <div className={classes["funding_host_profile"]}>
            <div>
              <h4 className={classes["funding_host_profile_h4"]}>
                창작자 소개
              </h4>
            </div>
            <div style={{ display: "flex" }}>
              <img src={Profileimg} className={classes["user"]} alt="Profile" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className={classes["host_nickname"]}>
                  {funding.host_nickname}
                </span>
                <span className={classes["host_introduce"]}>
                  회원가입창에서 입력한 소개글
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.content_area}>
        <div>
          <div
            className={`${classes["content-wrapper"]} ${
              isMoreView ? classes["expanded"] : classes["content-hidden"]
            }`}
          >
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: wrappedContent }}
            />
          </div>
          <div
            className={`${classes["more-view-button-wrapper"]} 
        ${isMoreView ? classes["button-hidden"] : ""}`}
          >
            <button
              className={classes["more-view-button"]}
              onClick={onClickImageMoreViewButton}
            >
              {isMoreView ? "상품정보 접기" : "상품정보 더보기"}
            </button>
          </div>
        </div>
        <div className={classes.reward_area}>
          <div className={classes.reportbtn}>
            <span>
              <GoShield
                className={classes.report_svg}
                style={{ marginRight: "7px" }}
              />펀딩에 문제가 있나요?
            </span>
            <span className={classes.report_right}>
              <GoChevronRight className={classes.report_svg} />신고하기
            </span>
          </div>
          <div className={classes.rewardtitle}>
            리워드 선택
          </div>
          <div className={classes.reward_list_area}>
            <SelectablRewardList
              rewards={funding.rewards}
              selectedReward={selectedReward}
              onChange={(v) => setSelectedReward(v)}
              disabled={!!funding.participated_reward_id}
            />
          </div>

          <div className={classes.joinBtn}>
            {funding.participated_reward_id
              // TODO(vi117): 환불 창 추가
              ? (
                <Button
                  className={classes["withdraw_funding_btn"]}
                  onClick={withdrawFunding}
                >
                  펀딩 참여 취소하기
                </Button>
              )
              : (
                <NavLink
                  to={`/fundings/${id}/pay/`}
                  state={{ funding: funding, selectedReward: selectedReward }}
                >
                  <Button
                    ref={JoinBtnRef}
                    className={classes["go_funding_btn"]}
                    disabled={!selectedReward}
                  >
                    펀딩 참여하기
                  </Button>
                </NavLink>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  async function setInterest(id, like = true) {
    const url = new URL(
      `/api/v1/fundings/${id}/interest`,
      window.location.origin,
    );
    url.searchParams.append("disset", !like);
    const res = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 401) {
      return "Unauthorized";
    } else if (res.status === 409) {
      return "Conflict";
    } else {
      mutate({
        ...funding,
        interest_user_id: like ? funding.host_id : null,
      });
    }
  }
  async function withdrawFunding() {
    if (!selectedReward) {
      throw new Error("not selected reward");
    }
    const url = new URL(
      `/api/v1/fundings/${id}/rewards/${selectedReward.id}/withdraw`,
      window.location.origin,
    );
    const res = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("withdraw error");
    }
    mutate({
      ...funding,
      participated_reward_id: null,
    });
    setSelectedReward(null);
  }
};

function InterestButton({ funding, setInterest }) {
  return (
    <>
      {funding.interest_user_id
        ? (
          <Button
            className={classes["interest_btn"]}
            onClick={() => {
              setInterest(funding.id, false);
            }}
          >
            <BiBookmark
              className={classes["btn_svg"]}
            />
          </Button>
        )
        : (
          <Button
            className={classes["interest_btn"]}
            onClick={() => {
              setInterest(funding.id);
            }}
          >
            <BiSolidBookmark
              className={classes["btn_svg"]}
            />
          </Button>
        )}
    </>
  );
}
function SelectablRewardList(
  { rewards, selectedReward, onChange = () => {}, disabled = false },
) {
  return (
    <ListGroup>
      <div className={classes.reward_list_container}>
        {rewards.map((reward) => {
          const restItem = reward.reward_count - reward.reward_current_count;
          return (
            <ListGroup.Item
              className={classes.reward_list}
              action
              variant="success"
              key={reward.id}
              onClick={() => {
                if (!disabled) {
                  onChange(reward);
                }
              }}
              active={selectedReward?.id === reward.id}
            >
              <div className={classes.reward_table}>
                <span className={classes.reward_price}>
                  {reward.price.toLocaleString()}원
                </span>
                <span className={classes.reward_restitem}>
                  현재 {restItem}개 남음!
                </span>
              </div>
              <div className={classes.reward_title}>{reward.title}</div>
              <div className={classes.reward_content}>{reward.content}</div>
              <div className={classes.reward_count}>
                제한 수량 <b>{reward.reward_count}</b> 개
              </div>
            </ListGroup.Item>
          );
        })}
      </div>
    </ListGroup>
  );
}

export default FundingsDetail;
