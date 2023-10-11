import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Carousel,
  FloatingLabel,
  Form,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { BiShareAlt } from "react-icons/bi";
import { GoChevronRight, GoShield } from "react-icons/go";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Container, ErrorPage, LoadingPage } from "../../component";
import { useLoginInfo } from "../../hook/useLogin";

import { useAlertModal } from "../../hook/useAlertModal";
import { useConfirmModal } from "../../hook/useConfirmModal";
import useFundingDetail from "../../hook/useFundingDetail";
import { FetchError } from "../../hook/util";

import { formatDate } from "./../../util/date";
import { isPSApprovedTag } from "./../../util/tag";
import Profileimg from "../community/assets/user.png";
import { InterestButton } from "./component/InterestButton";
import classes from "./FundingsDetail.module.css";
import FundingDetailModal from "./FundingsDetailModal";

import {
  fundingDelete,
  postFundingReport,
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
  const { ConfirmModal, showConfirmModal } = useConfirmModal();
  const navigate = useNavigate();

  const onClickImageMoreViewButton = () => {
    setIsMoreView(!isMoreView);
  };

  const userInfo = useLoginInfo();
  const user_id = userInfo?.id;

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

  // TODO(vi117): spinner 대신 Bootstrap.Placeholder 띄우기.
  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    if (error instanceof FetchError && error.info.code === "DELETED") {
      return (
        <Container>
          <ErrorPage
            error={{
              message: "비공개 처리된 펀딩입니다.",
            }}
          >
          </ErrorPage>
        </Container>
      );
    }
    return <ErrorPage error={error} />;
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

  const fundingIsOver = (new Date(funding.end_date).getTime()) < Date.now();
  // const wrappedContent = wrapImages(content);

  return (
    <Container>
      {showModal && (
        <FundingDetailModal
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
      <AlertModal />
      <ConfirmModal />

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
                      <NavLink to={`/fundings/${id}/edit`} state={funding}>
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
          {(() => {
            // 비로그인일때
            if (!userInfo) {
              return "";
            }
            // 관리자가 아닐 때
            if (!userInfo.is_admin) {
              return "";
            }
            return (
              <Button className="mt-3" onClick={softDeleteFunding}>
                비공개
              </Button>
            );
          })()}
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
              <Report funding_id={funding.id} />
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
              // TODO(vi117): 환불 창 추가 (231010 당현진처리,환불페이지는 아니고 취소 확인창)
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
                  to={(!fundingIsOver) ? `/fundings/${id}/pay/` : false}
                  state={{ funding: funding, selectedReward: selectedReward }}
                >
                  <Button
                    ref={JoinBtnRef}
                    className={classes["go_funding_btn"]}
                    disabled={fundingIsOver}
                  >
                    펀딩 참여하기
                  </Button>
                </NavLink>
              )}
          </div>
        </div>
      </div>
    </Container>
  );

  async function softDeleteFunding() {
    try {
      await fundingDelete(funding.id);
    } catch (error) {
      console.log(error);
      // TODO(vi117): 예쁜 alert 쓰기.(231010 당현진처리)
      await showAlertModal(
        "비공개 설정을 실패했습니다.",
        "계속되는 실패시, 관리자에게 문의해주세요.",
      );
    }
  }
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
    if (await showConfirmModal("펀딩 참여취소", "정말로 취소하시겠습니까?")) {
      try {
        await withdrawFundingAPI(funding.id, selectedReward.id);
        await showAlertModal(
          "펀딩 참여 취소 완료",
          "취소 처리되었습니다. 환불 관련 문의는 관리자에게 문의해주세요.",
        );
      } catch (e) {
        if (e instanceof Error) {
          await showAlertModal(
            "펀딩 참여 취소 실패",
            "로그인 후 다시 시도해보시고, 연속 실패시 관리자에게 문의해주세요.",
          );
        } else throw e;
      }
    } else {
      return false;
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

function Report({
  funding_id,
}) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { showAlertModal, AlertModal } = useAlertModal();

  return (
    <>
      <AlertModal />
      <div
        className={classes["go_report"]}
        onClick={handleShow}
      >
        신고하기
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold", marginLeft: "10px" }}>
            펀딩 신고
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={classes["ReportModal"]}>
            신고 사유를 선택하고 상세 사유를 작성해주세요.
            <br></br>
            관련한 증빙자료를 첨부해주시면 더욱 빠른 확인이 가능합니다.
            <br></br>
            <p>신고 사유</p>
            <Form.Select
              aria-label="Default select example"
              style={{ marginBottom: "10px", fontSize: "14px" }}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option>옵션을 선택해주세요</option>
              <option value="이용약관 또는 펀딩 심사 기준 위반">
                이용약관 또는 펀딩 심사 기준 위반
              </option>
              <option value="커뮤니티 운영원칙 위반">
                커뮤니티 운영원칙 위반
              </option>
              <option value="개인정보 보호 권리 침해">
                개인정보 보호 권리 침해
              </option>
              <option value="지식재산권 침해">지식재산권 침해</option>
              <option value="펀딩 이행 문제 관련">펀딩 이행 문제 관련</option>
              <option value="기타">
                기타/ 자세한 사유를 기재해주세요
              </option>
            </Form.Select>
            <FloatingLabel
              controlId="floatingTextarea2"
              label="자세한 신고 사유를 작성해주세요"
              style={{ fontSize: "14px", color: "rgb(158, 158, 158)" }}
            >
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "150px" }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </FloatingLabel>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label style={{ marginTop: "20px", fontSize: "13px" }}>
                첨부파일(선택)
              </Form.Label>
              <Form.Control
                type="file"
                multiple
                style={{ fontSize: "14px" }}
                onChange={(e) => setFiles(e.target.files)}
              />
            </Form.Group>
            <p style={{ fontSize: "11px" }}>
              * 신고내용이 허위 사실인 경우, 이용에 제재를 받을 수 있습니다.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            style={{ marginRight: "7px" }}
            onClick={handleClose}
          >
            취소
          </Button>
          <Button
            variant="outline-success"
            onClick={() => {
              submitReport();
              handleClose();
            }}
          >
            제출
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  async function submitReport() {
    try {
      await postFundingReport(funding_id, {
        content: `#${category}\n${content}`,
        files: files,
      });
      // TODO(vi117): show alert.(231010 당현진처리)
      await showAlertModal(
        "전송완료",
        "신고 접수되었습니다.",
      );
    } catch (error) {
      console.log(error);
      // TODO(vi117): show alert.(231010 당현진처리)
      await showAlertModal(
        "전송실패",
        "로그인 되었는지 확인하시고, 신고 사유를 작성하시어 다시 시도해주세요.",
      );
    }
  }
}
export default FundingsDetail;
