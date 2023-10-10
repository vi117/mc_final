import { useRef, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useLoginInfo } from "../../hook/useLogin";
import classes from "./FundingsWrite.module.css";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagsInput } from "react-tag-input-component";

import { useLocation, useNavigate } from "react-router-dom";
import { postFundingRequestAsJson } from "../../api/funding";
import { Container, LoadingPage } from "../../component";
import Calender from "../../component/Calender";
import { Editor } from "../../component/Editor";
import UploadImage from "./../../component/UploadFile";
import { useUploadFile } from "../../component/UploadFile/hook";
import { useFundingRequestById } from "../../hook/useFundingRequestById";
import { cutNickname } from "../../util/cut";
import { Guide } from "./component/Guide";

// import { formatDate } from "./../../util/date";

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

function FundingEditPage() {
  const location = useLocation();
  const funding = location.state;

  const { data, error, isLoading } = useFundingRequestById(
    funding.funding_request_id,
  );
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  if (isLoading) {
    return <LoadingPage />;
  }
  console.log(data);
  return <FundingsEdit fundingRequest={data} funding={funding} />;
}

/**
 * @param {object} props
 * @param {import("dto").FundingRequestObject} props.fundingRequest
 * @param {import("dto").FundingObject} props.funding
 * @returns
 */
const FundingsEdit = function({
  fundingRequest,
  funding,
}) {
  console.log(funding, fundingRequest);
  const [title, setTitle] = useState(funding.title);
  const [startDate, setStartDate] = useState(
    new Date(funding.begin_date),
  );
  const [endDate, setEndDate] = useState(new Date(funding.end_date));
  /**
   * @type { [string[], (tags: string[])=>void] }
   */
  const [tagSelected, setSelected] = useState(funding.tags.map(x => x.tag));
  const thumbnailState = useUploadFile(
    [funding.thumbnail],
    {
      onDelete: () => {
        thumbnailState.resetImage();
      },
    },
  );

  const contentThumbnails = useUploadFile(
    funding.content_thumbnails ?? [],
  );
  const [content, setContent] = useState(fundingRequest.content);
  const [accountNumber, setAccountNumber] = useState(
    fundingRequest.meta_parsed.account_number ?? "",
  );
  const [accountBankName, setAccountBankName] = useState(
    fundingRequest.meta_parsed.account_bank_name ?? "",
  );
  // const [certificateFiles, setCertificateFiles] = useState(null);
  const certficateFilesState = useUploadFile(
    fundingRequest.meta_parsed.certificate ?? [],
  );

  const navigate = useNavigate();
  const userInfo = useLoginInfo();
  const infoAreaRef = useRef(null);
  const StoryAreaRef = useRef(null);
  const MakerAreaRef = useRef(null);
  const scrollToInfoArea = () => {
    document.body.scrollIntoView();
  };
  const scrollToStoryArea = () => {
    StoryAreaRef.current.scrollIntoView({});
  };
  const scrollToMakerArea = () => {
    MakerAreaRef.current.scrollIntoView({});
  };

  return (
    <Container className={"d-flex " + classes.funding_write_wrap}>
      <FundingWriteNavigator nickname={userInfo.nickname}>
        <button onClick={() => scrollToInfoArea()}>
          프로젝트 기본 정보
        </button>
        <button onClick={() => scrollToStoryArea()}>
          스토리 작성
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
        </div>
        <hr className={classes.hr} />

        <div
          className={classes.item_container}
          ref={StoryAreaRef}
        >
          <h1>스토리 작성</h1>
          <div className={classes.story_area}>
            <h2>썸네일</h2>
            <UploadImage state={thumbnailState} />
          </div>

          <Form.Group
            controlId="formFileMultiple"
            className={classes.story_area}
          >
            <h2>콘텐츠 썸네일</h2>
            <p>콘텐츠 썸네일 사진을 업로드해주세요.</p>
            <UploadImage state={contentThumbnails} multiple />
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
              onChange={(e) => setAccountBankName(e.target.value)}
              value={accountBankName}
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
            <UploadImage state={certficateFilesState} multiple />
          </div>
        </div>
      </div>
    </Container>
  );

  async function sendRequest() {
    try {
      await postFundingRequestAsJson({
        funding_id: funding.id,
        title,
        thumbnail: thumbnailState.images[0],
        content,
        contentThumbnails: contentThumbnails.images,
        startDate,
        endDate,
        tags: tagSelected,
        accountNumber,
        targetValue: funding.target_value,
        certificateFiles: certficateFilesState.images,
        rewards: funding.rewards.map((r) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          price: r.price,
          reward_count: r.reward_count,
        })),
      });
      alert("요청이 접수되었습니다.");
      navigate("/fundings");
    } catch (e) {
      console.log(e);
      alert("요청이 실패되었습니다.");
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
        <li className={classes.list_big}>안녕하세요,</li>
        <li className={classes.list_big} style={{ marginBottom: "10px" }}>
          <b>{cutNickname(nickname, 8)}</b> 님!
        </li>
        <li>펀딩 수정은</li>
        <li>리워드 설계는 불가하며,</li>
        <li>종료일 이내로만 가능합니다.</li>
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

export default FundingEditPage;
