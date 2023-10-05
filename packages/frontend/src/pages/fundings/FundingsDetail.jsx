import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Carousel,
  FloatingLabel,
  Form,
  ListGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { BiShareAlt } from "react-icons/bi";
import { GoChevronRight, GoShield } from "react-icons/go";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useLoginId } from "../../hook/useLogin";

import { useAlertModal } from "../../hook/useAlertModal";
import useFundingDetail from "../../hook/useFundingDetail";
import { formatDate } from "./../../util/date";
import { isPSApprovedTag } from "./../../util/tag";
import Profileimg from "../community/assets/user.png";
import { InterestButton } from "./component/InterestButton";
import classes from "./FundingsDetail.module.css";
import FundingDetailModal from "./FundingsDetailModal";

import {
  setFundingInterest,
  withdrawFunding as withdrawFundingAPI,
} from "../../api/mod";

const FundingsDetail = function() {
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const { data: funding, error, isLoading, mutate } = useFundingDetail(id);
  const [isMoreView, setIsMoreView] = useState(false);
  const JoinBtnRef = useRef(null);
  const { AlertModal, showAlertModal } = useAlertModal();
  const navigate = useNavigate();
  const onClickImageMoreViewButton = () => {
    setIsMoreView(!isMoreView);
  };
  const user_id = useLoginId();
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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const restTime = new Date(funding.end_date).getTime() - new Date().getTime();

  const content_thumbnails = funding.content_thumbnails.length > 0
    ? funding.content_thumbnails
    : [funding.thumbnail];

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

  const content = funding.content;
  const wrappedContent = content;
  // const wrappedContent = wrapImages(content);

  return (
    <div className={classes["funding_detail_container"]}>
      {showModal && (
        <FundingDetailModal
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
      <AlertModal />

      <div className={classes["funding_title"]}>
        <ul className={classes["funding_detail_tags"]}>
          {funding.tags.map((tag) => (
            <li
              key={tag.id}
              className={clsx({
                [classes["funding_detail_tags_ps_approved"]]: isPSApprovedTag(
                  tag,
                ),
              })}
            >
              #{tag.tag}
            </li>
          ))}
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
          <hr className={classes.hr} />
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
            <Button
              className={classes.share_button}
              onClick={() => {
                handleOpenModal();
              }}
            >
              <BiShareAlt
                className={classes["btn_svg"]}
              />
            </Button>

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

          <NavLink to={`/host-profile/${funding.host_id}`}>
            <div className={classes["funding_host_profile"]}>
              <div>
                <div>
                  <h4 className={classes["funding_host_profile_h4"]}>
                    창작자 소개
                  </h4>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={funding.host_profile_image ?? Profileimg}
                    className={classes["user"]}
                    alt="Profile"
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className={classes["host_nickname"]}>
                      {funding.host_nickname}
                    </span>
                    <span className={classes["host_introduce"]}>
                      {funding.host_introduction}
                    </span>
                  </div>
                </div>
              </div>
              <div className={classes.edit_btn_area}>
                {
                  <>
                    {user_id === funding.host_id && (
                      <NavLink to={`/fundings/${id}/edit`}>
                        <button className={classes.edit_btn}>
                          펀딩<br></br>수정하기
                        </button>
                      </NavLink>
                    )}
                  </>
                }
              </div>
            </div>
          </NavLink>
        </div>
      </div>

      <div className={classes.content_area}>
        <div>
          <div
            className={clsx(classes["content-wrapper"], {
              [classes["expanded"]]: isMoreView,
            })}
          >
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: wrappedContent }}
            />
          </div>
          <div
            className={clsx(classes["more-view-button-wrapper"], {
              [classes["more-view-button-wrapper-shrink"]]: !isMoreView,
            })}
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
              <GoChevronRight className={classes.report_svg} />
              <Report />
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
                  ref={JoinBtnRef}
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
    if (!funding) {
      return;
    }
    const status = await setFundingInterest(id, like);
    if (status === "Conflict") {
      return;
    }
    if (status === "Unauthorized") {
      // need login
      await showAlertModal("error", "로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    mutate({
      ...funding,
      interest_user_id: like ? funding.host_id : null,
    });
  }

  async function withdrawFunding() {
    if (!selectedReward) {
      // unreachable
      throw new Error("not selected reward");
    }
    try {
      await withdrawFundingAPI(funding.id, selectedReward.id);
    } catch (e) {
      console.log(e);
      await showAlertModal("withdraw error", e.message);
      return;
    }
    mutate({
      ...funding,
      participated_reward_id: null,
    });
    setSelectedReward(null);
  }
};

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
              className={clsx(classes.reward_list, {
                [classes.reward_selected]: selectedReward?.id === reward.id,
              })}
              action
              bsPrefix="5151a"
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

function Report() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div
        className={classes["go_report"]}
        onClick={handleShow}
      >
        신고하기
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold" }}>
            펀딩 신고
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={classes["ReportModal"]}>
            신고 사유를 선택하고 상세 사유와 URL을 작성해주세요.
            <br></br>
            관련한 증빙자료를 첨부해주시면 더욱 빠른 확인이 가능합니다.
            <br></br>
            <p>신고 사유</p>
          </div>
          <Form.Select
            aria-label="Default select example"
            style={{ marginBottom: "10px", fontSize: "14px" }}
          >
            <option>옵션을 선택해주세요</option>
            <option value="1">이용약관 또는 펀딩 심사 기준 위반</option>
            <option value="2">커뮤니티 운영원칙 위반</option>
            <option value="3">개인정보 보호 권리 침해</option>
            <option value="4">지식재산권 침해</option>
            <option value="5">펀딩 이행 문제 관련</option>
            <option value="6">기타/사유를 자세히 기재해주세요</option>
          </Form.Select>
          <FloatingLabel
            controlId="floatingTextarea2"
            label="자세한 신고 사유와 문제가 되는 펀딩의 URL을 작성해주세요"
            style={{ fontSize: "14px" }}
          >
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label style={{ marginTop: "10px", fontSize: "13px" }}>
              첨부파일(선택)
            </Form.Label>
            <Form.Control type="file" multiple />
          </Form.Group>
          <p>* 신고내용이 허위 사실인 경우, 이용에 제재를 받을 수 있습니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleClose}>
            제출
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default FundingsDetail;
