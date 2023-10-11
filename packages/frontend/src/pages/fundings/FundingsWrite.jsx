import { useRef, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useLoginInfo } from "../../hook/useLogin";
import classes from "./FundingsWrite.module.css";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagsInput } from "react-tag-input-component";

import { Navigate, useNavigate } from "react-router-dom";
import { APIError } from "../../api/error";
import { postFundingRequest } from "../../api/funding";
import Calender from "../../component/Calender";
import { Container } from "../../component/Container";
import { Editor } from "../../component/Editor";
import useAlertModal from "../../hook/useAlertModal";
import { cutNickname } from "../../util/cut";
import { Guide } from "./component/Guide";
import { RewardItemList } from "./component/RewardItemList";

/**
 * Renders the TagWrite component.
 *
 * @param {Object} props - The props object containing the selected and onChange properties.
 *   - {Array} selected - The array of selected tags.
 *   - {(tags: string[]) => void} onChange - The callback function to handle changes in the selected tags.
 * @return {JSX.Element} The JSX element representing the TagWrite component.
 */
const TagWrite = ({
  selected,
  onChange,
}) => {
  return (
    <div className={classes.funding_write_tagsearch}>
      <TagsInput
        value={selected}
        onChange={onChange}
        name="fruits"
        placeHolder={selected.length === 0
          ? "엔터로 태그를 입력해주세요"
          : ""}
      />
    </div>
  );
};

const FundingsWrite = function() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  /**
   * @type { [string[], (tags: string[])=>void] }
   */
  const [tagSelected, setSelected] = useState([]);
  /**
   * @type { [File[], (files: File[])=>void] }
   */
  const [thumbnail, setThumbnail] = useState([]);
  const [contentThumbnails, setContentThumbnails] = useState([]);
  const [targetValue, setTargetValue] = useState(0);
  const [content, setContent] = useState("");
  const [rewards, setRewards] = useState([]);
  const [accountBankName, setAccountBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [certificateFiles, setCertificateFiles] = useState(null);

  const navigate = useNavigate();
  const userInfo = useLoginInfo();
  const infoAreaRef = useRef(null);
  const StoryAreaRef = useRef(null);
  const RewardAreaRef = useRef(null);
  const MakerAreaRef = useRef(null);

  const { showAlertModal, AlertModal } = useAlertModal();

  const scrollToInfoArea = () => {
    document.body.scrollIntoView();
  };
  const scrollToStoryArea = () => {
    StoryAreaRef.current.scrollIntoView({});
  };
  const scrollToRewardArea = () => {
    RewardAreaRef.current.scrollIntoView({});
  };
  const scrollToMakerArea = () => {
    MakerAreaRef.current.scrollIntoView({});
  };
  if (!userInfo) {
    return <Navigate to="/login"></Navigate>;
  }

  return (
    <>
      <AlertModal />
      <Container className={"d-flex " + classes.funding_write_wrap}>
        <FundingWriteNavigator nickname={userInfo.nickname}>
          <button onClick={() => scrollToInfoArea()}>
            프로젝트 기본 정보
          </button>
          <button onClick={() => scrollToStoryArea()}>
            스토리 작성
          </button>
          <button onClick={() => scrollToRewardArea()}>
            리워드 설계
          </button>
          <button onClick={() => scrollToMakerArea()}>
            메이커 정보
          </button>
          <button
            className={classes.go_write}
            onClick={() => {
              sendRequest();
            }}
          >
            완료
          </button>
        </FundingWriteNavigator>

        <div className={classes.funding_write_container}>
          <div className={classes.item_container_title} ref={infoAreaRef}>
            <h1>기본 정보</h1>

            <div className={classes.info_area}>
              <h2>카테고리 태그 선택</h2>
              <p>
                펀딩과 가장 잘 어울리는 태그를 입력해 주세요.
                <br />적합하지 않을 경우 운영자에 의해 조정될 수 있습니다.
              </p>
              <TagWrite selected={tagSelected} onChange={setSelected} />
            </div>

            <Form.Group className={classes.info_area}>
              <h2>펀딩 제목</h2>
              <p>
                펀딩의 주제, 창작물의 특징이 드러나는 멋진 제목을 붙여주세요.
              </p>
              <Form.Control
                type="text"
                className={classes.title_input}
                placeholder="제목을 입력해주세요."
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </Form.Group>

            <Form.Group className={classes.info_area}>
              <h2>개설기간</h2>
              <p>설정한 일시가 되면 펀딩이 자동 시작됩니다.</p>
              <Calender
                startDate={startDate}
                endDate={endDate}
                onChange={(e) => {
                  setStartDate(e.startDate);
                  setEndDate(e.endDate);
                }}
              />
            </Form.Group>

            <Form.Group className={classes.info_area}>
              <h2>목표금액</h2>
              <p>프로젝트를 완수하기 위해 필요한 금액을 설정해주세요.</p>
              <TargetValueGuide />
              <div className={classes.value_input}>
                <Form.Control
                  className={classes.title_input}
                  type="text"
                  placeholder="목표금액(숫자만)"
                  pattern="[0-9]*"
                  value={targetValue}
                  onChange={(e) => {
                    /**
                     * @type {string}
                     */
                    const value = e.target.value;
                    const num_value = parseInt(value);
                    setTargetValue(
                      isNaN(num_value) ? 0 : num_value,
                    );
                  }}
                />
                <span>원</span>
              </div>
            </Form.Group>
          </div>
          <hr className={classes.hr} />

          <div
            className={classes.item_container}
            ref={StoryAreaRef}
          >
            <h1>스토리 작성</h1>
            <div className={classes.story_area}>
              <h2>썸네일</h2>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    console.log(e.target.files);
                    setThumbnail(e.target.files);
                  }}
                />
              </Form.Group>
            </div>

            <Form.Group
              controlId="formFileMultiple"
              className={classes.story_area}
            >
              <h2>콘텐츠 썸네일</h2>
              <p>콘텐츠 썸네일 사진(내부 썸내일 사진)을 업로드해주세요.</p>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => {
                  console.log(e.target.files);
                  setContentThumbnails(e.target.files);
                }}
              />
            </Form.Group>

            <div className={classes.story_area_editor}>
              <h2>펀딩 스토리</h2>
              <p>무엇을 만들기 위한 프로젝트인지 분명히 알려주세요.</p>
              <StoryTipGuide />
              <Editor
                onChange={(v) => {
                  setContent(v);
                }}
                value={content}
              />
            </div>
          </div>
          <hr className={classes.hr} />

          <div
            className={classes.item_container}
            ref={RewardAreaRef}
          >
            <h1>리워드 설계</h1>
            <div>
              <p>
                선물은 후원자에게 프로젝트의 가치를 전달하는 수단입니다.<br>
                </br>
                다양한 금액대로 여러 개의 선물을 만들어주세요. <br></br>
                펀딩 성공률이 높아지고, 더 많은 후원 금액을 모금할 수 있어요.
              </p>
              <RewardTipGuide />
              <RewardItemList
                onChange={(v) => {
                  setRewards(v);
                }}
              />
            </div>
          </div>
          <hr className={classes.hr} />
          <div
            className={classes.item_container}
            style={{ paddingBottom: "50px" }}
            ref={MakerAreaRef}
          >
            <h1>메이커 정보</h1>
            <div className={classes.maker_area}>
              <h2>계좌연결</h2>
              <p>
                ・ 후원금을 전달받을 계좌를 등록해주세요. 법인사업자는
                법인계좌로만 정산받을 수 있습니다. <br></br>
                ・ 입금이 가능한 계좌인지 확인 후 입력해 주세요.<br></br>
                ・ 저축성 예금 계좌, 외화 예금 계좌, CMA 계좌, 평생
                계좌번호(휴대전화 번호) 등은 입금이 불가합니다.
              </p>
              <Form.Select
                className={classes.option_form}
                aria-label="Default select example"
                value={accountBankName}
                onChange={(e) => {
                  setAccountBankName(e.target.value);
                }}
              >
                <option>은행명</option>
                <option value="기업">기업</option>
                <option value="국민">국민</option>
                <option value="신한">신한</option>
              </Form.Select>
              <Form.Control
                className={classes.title_input}
                type="text"
                placeholder="계좌번호"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div className={classes.maker_area}>
              <h2>증명등록</h2>
              <p>
                증명등록에 필요한 파일을
                업로드해주세요.(주민등록증or사업자등록증)(인증서)
              </p>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => {
                  console.log(e.target.files);
                  setCertificateFiles(e.target.files);
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );

  async function sendRequest() {
    if (title === "") {
      await showAlertModal("제목", "제목을 입력해주세요.");
      return;
    }
    if (content === "") {
      await showAlertModal("내용", "내용을 입력해주세요.");
      return;
    }
    if (targetValue === "" || isNaN(parseInt(targetValue))) {
      await showAlertModal("목표금액", "목표금액을 입력해주세요.");
      return;
    }
    if (rewards.length === 0) {
      await showAlertModal("리워드", "리워드를 입력해주세요.");
      return;
    }
    if (thumbnail.length === 0) {
      await showAlertModal("썸네일", "썸네일을 업로드해주세요.");
      return;
    }

    try {
      await postFundingRequest({
        title,
        thumbnail: thumbnail[0],
        content,
        contentThumbnails,
        targetValue: parseInt(targetValue),
        startDate,
        endDate,
        tags: tagSelected,
        rewards,
        accountNumber,
        certificateFiles,
        accountBankName,
      });
      await showAlertModal("요청완료", "관리자의 승인을 기다려주세요.");
      navigate("/fundings");
    } catch (e) {
      console.log(e);
      if (e instanceof APIError) {
        if (e.data.code == "DUPLICATED_TITLE") {
          await showAlertModal("요청 실패", "제목이 중복되었습니다.");
          return;
        }
      }
      await showAlertModal(
        "요청실패",
        "계속되는 실패시, 관리자에게 문의해주세요.",
      );
    }
  }
};

function FundingWriteNavigator({
  nickname,
  children,
}) {
  return (
    <nav className={classes.funding_profile_container}>
      <ul className={classes.profile_title}>
        <li className={classes.list_big}>환영해요,</li>
        <li className={classes.list_big} style={{ marginBottom: "10px" }}>
          <b>{cutNickname(nickname, 8)}</b> 님!
        </li>
        <li>해피테일즈에서</li>
        <li>멋진 프로젝트를 만들어보세요</li>
      </ul>
      <ListGroup
        variant="flush"
        className={classes.profile_container}
      >
        {children}
      </ListGroup>
    </nav>
  );
}

function RewardTipGuide() {
  return (
    <Guide title="리워드 설계 조건">
      <li>혜택이 좋은 순서대로 등록해 주세요.</li>
      <li>
        각 리워드끼리 쉽게 구분될 수 있도록 규칙적이고 정확한 리워드명을 사용해
        주세요.
      </li>
      <li>
        각 리워드별 제공할 수 있는 수량을 입력해 주세요. 제한된 수량이 모두
        소진되면 이 리워드를 선택할 수 없어요.
      </li>
    </Guide>
  );
}

function StoryTipGuide() {
  return (
    <Guide title="스토리 작성 TIP">
      <li>
        이미지로만 구성된 스토리는 이미지 로딩 속도가 느려 방문자가 상세
        페이지를 벗어날 확률이 높아져요.
      </li>
      <li>
        아래의 질문에 대한 답이 내용에 포함되도록 작성해보세요.
      </li>
      <li>Q. 무엇을 만들기 위한 펀딩인가요?</li>
      <li>Q. 펀딩을 간단히 소개한다면?</li>
      <li>Q. 이 펀딩이 왜 의미있나요?</li>
    </Guide>
  );
}

function TargetValueGuide() {
  return (
    <Guide title="목표 금액 설정 시 꼭 알아두세요!">
      <li>
        종료일까지 목표금액을 달성하지 못하면 후원자 결제가 진행되지 않습니다.
      </li>
      <li>
        후원 취소 및 결제 누락을 대비해 10% 이상 초과 달성을 목표로 해주세요.
      </li>
      <li>
        제작비, 선물 배송비, 인건비, 예비 비용 등을 함께 고려해주세요.
      </li>
    </Guide>
  );
}

export default FundingsWrite;
