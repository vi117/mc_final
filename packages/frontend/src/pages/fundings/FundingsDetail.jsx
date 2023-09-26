import { useEffect, useState } from "react";
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

const FundingsDetail = function() {
  const { id } = useParams();
  const { data: funding, error, isLoading, mutate } = useFundingDetail(id);

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
    // TODO(vi117): spinner 대신 Bootstrap.Placeholder 띄우기.
    return <Spinner />;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  const restTime = new Date(funding.end_date).getTime() - new Date().getTime();
  const content_thumbnails = funding.content_thumbnails.length > 0
    ? funding.content_thumbnails
    : [funding.thumbnail];
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

        <div className={classes["funding_detail_profile"]}>
          <div>
            <h4 className={classes["funding_profile_h4"]}>남은 기간</h4>
            <span className={classes["funding_profile_text"]}>
              {restTime / (1000 * 60 * 60 * 24) > 0
                ? (
                  <>
                    {(restTime / (1000 * 60 * 60 * 24)).toFixed(0)}
                    <span className={classes["funding_profile_small"]}>일</span>
                  </>
                )
                : <>종료</>}
            </span>
          </div>

          <div>
            <h4 className={classes["funding_profile_h4"]}>달성도</h4>
            <div>
              <>
                <span className={classes["funding_profile_text"]}>
                  {funding.current_value.toLocaleString()}
                </span>
                <span className={classes["funding_profile_small"]}>
                  원
                </span>
              </>{" "}
              <>
                {(funding.current_value / funding.target_value * 100).toFixed(
                  1,
                )}% 달성
              </>
            </div>
          </div>

          <div>
            <h4 className={classes["funding_profile_h4"]}>호스트</h4>
            <div>
              <img src={Profileimg} className={classes["user"]} alt="Profile" />
              {funding.host_nickname}
            </div>
          </div>
          <ButtonGroup vertical>
            <DropdownButton
              as={ButtonGroup}
              title="공유하기💌"
              id="bg-vertical-dropdown-1"
            >
              <Dropdown.Item eventKey="1">인스타</Dropdown.Item>
              <Dropdown.Item eventKey="2">네이버블로그</Dropdown.Item>
              <Dropdown.Item eventKey="3">트위터X</Dropdown.Item>
              <Dropdown.Item eventKey="4">페이스북</Dropdown.Item>
              <Dropdown.Item eventKey="5">링크</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>

          <InterestButton funding={funding} setInterest={setInterest} />
        </div>
      </div>

      <hr></hr>
      <div>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: funding.content }}
        >
        </div>
      </div>
      <div className={classes.rewardList}>
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
            <Button variant="danger" onClick={withdrawFunding}>
              취소
            </Button>
          )
          : (
            <NavLink
              to={`/fundings/${id}/pay/`}
              state={{ funding: funding, selectedReward: selectedReward }}
            >
              <Button
                variant="success"
                disabled={!selectedReward}
              >
                참가
              </Button>
            </NavLink>
          )}
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
            variant="outline-dark"
            onClick={() => {
              setInterest(funding.id, false);
            }}
          >
            관심취소⭐
          </Button>
        )
        : (
          <Button
            variant="outline-dark"
            onClick={() => {
              setInterest(funding.id);
            }}
          >
            관심설정⭐
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
      {rewards.map((reward) => (
        <ListGroup.Item
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
          <h3>{reward.title}</h3>
          {reward.content}
          {reward.price} 원 총 {reward.reward_count} 개 현재{" "}
          {reward.reward_current_count} 개
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default FundingsDetail;
