import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Carousel,
  Container,
  Dropdown,
  DropdownButton,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";
import { useLogin } from "../../hook/useLogin";
import classes from "./FundingsDetail.module.css";

const placeholder = "https://via.placeholder.com/850x375";

const fundings = [
  {
    id: 1,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: 1000,
    current_value: 500,
  },
  {
    id: 2,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 3,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
];

const FundingsDetail = function() {
  const { id } = useParams();
  const { data: funding, error, isLoading, mutate } = useSWR(
    `/api/v1/fundings/${id}`,
    (url) => fetch(url).then((res) => res.json()),
  );
  const user_id = useLogin();
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
  return (
    <Container
      style={{ paddingTop: "20px", "maxWidth": "var(--max-content-width)" }}
    >
      <div className={classes.sujung}>
        {user_id === funding.host_id && (
          <NavLink to={`/fundings/${id}/edit`}>
            <Button variant="success">수정</Button>
          </NavLink>
        )}
      </div>
      <Row>
        <Col sm={8} className={classes.fundingName}>
          <h1>{funding.title}</h1>
        </Col>

        <Col className={classes.tags}>
          {funding.tags.map((tag) => <Badge>{tag.tag}</Badge>)}
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          <Carousel slide={false}>
            <Carousel.Item>
              <img src={placeholder} text="First slide" />
              <Carousel.Caption>
                <h3>썸네일 Carousel or 사진한장</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={placeholder} text="Second slide" />
              <Carousel.Caption>
                <h3>썸네일 Carousel or 사진한장</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={placeholder} text="Third slide" />
              <Carousel.Caption>
                <h3>Third slide label</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>

        <Col sm={4}>
          <Row style={{ margin: "16px" }}>
            {/* TODO(vi117): 예쁘게 날짜 출력 */}
            <div>
              개설기간: {(new Date(funding.begin_date)).toDateString()} ~
              {(new Date(funding.end_date)).toDateString()}
              달성도: {funding.current_value} 원/{funding.target_value} 원
            </div>
          </Row>

          <Row>
            <div>{funding.host_nickname}</div>
          </Row>
          <Row style={{ "padding": "10px 0px 10px 0px" }}>
            <Col className="sns">
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
            </Col>
            <Col className={classes.wishList}>
              <InterestButton funding={funding} setInterest={setInterest} />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          {funding.content}
        </Col>
        <Col sm={4}>
          <Row className={classes.rewardList}>
            <SelectablRewardList
              rewards={funding.rewards}
              selectedReward={selectedReward}
              onChange={(v) => setSelectedReward(v)}
              disabled={!!funding.participated_reward_id}
            />
          </Row>

          <Row className={classes.joinBtn}>
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
          </Row>
        </Col>
      </Row>

      <Container>
        <Row md={3} xs={1}>
          {fundings.map((x) => (
            <div key={x.id}>
              <NavLink to={`/fundings/${x.id}`}>
                <img
                  src={x.thumbnail}
                  style={{ width: "100%" }}
                  alt="썸네일 이미지"
                />
                <div>{x.tag}</div>
                <h3>{x.title}</h3>
                <div style={{ "overflow": "ellipsis" }}>{x.content}</div>
                <h3>달성도:{(x.current_value / x.target_value) * 100}%</h3>
              </NavLink>
            </div>
          ))}
        </Row>
      </Container>
    </Container>
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
