import { useRef, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import classes from "./FundingWrite.module.css";

// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagsInput } from "react-tag-input-component";

import { GoInfo } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { Editor } from "../../component/Editor";
import { Calender } from "./component/Calender";
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
  const [tagSelected, setSelected] = useState([]);
  const [thumbnail, setThumbnail] = useState([]);
  const [contentThumbnails, setContentThumbnails] = useState([]);
  const [targetValue, setTargetValue] = useState(0);
  const [content, setContent] = useState("");
  const [rewards, setRewards] = useState([]);
  const navigate = useNavigate();
  const infoAreaRef = useRef(null);
  const StoryAreaRef = useRef(null);
  const RewardAreaRef = useRef(null);
  const MakerAreaRef = useRef(null);
  const scrollToInfoArea = () => {
    infoAreaRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const scrollToStoryArea = () => {
    StoryAreaRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToRewardArea = () => {
    RewardAreaRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToMakerArea = () => {
    MakerAreaRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className={classes.funding_write_wrap}>
        <div className={classes.funding_profile_container}>
          <div className={classes.profile_title}>
            안녕하세요<br></br> user 님!
            <p>
              해피테일즈에서<br></br>
              멋진 프로젝트를 만들어보세요
            </p>
          </div>
          <ListGroup
            variant="flush"
            className={classes.profile_container}
          >
            <button onClick={() => scrollToInfoArea()}>
              <span>프로젝트 기본 정보</span>
              <p>
                프로젝트<br></br>기본정보
              </p>
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
          </ListGroup>
        </div>
        <div className={classes.funding_write_container}>
          <div className={classes.item_container_title}>
            <div ref={infoAreaRef} className={classes.info_area}>
              <h1>카테고리 태그 선택</h1>
              <p>
                펀딩과 가장 잘 어울리는 태그를 입력해 주세요.
                <br />적합하지 않을 경우 운영자에 의해 조정될 수 있습니다.
              </p>
              <TagWrite selected={tagSelected} onChange={setSelected} />
            </div>

            <Form.Group className={classes.info_area}>
              <h1>펀딩 제목</h1>
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
              <h1>개설기간</h1>
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
              <h1>목표금액</h1>
              <p>프로젝트를 완수하기 위해 필요한 금액을 설정해주세요.</p>
              <ul className={classes.guide}>
                <li className={classes.guide_bold}>
                  <GoInfo className={classes.guide_svg}></GoInfo>
                  목표 금액 설정 시 꼭 알아두세요!
                </li>
                <li>
                  종료일까지 목표금액을 달성하지 못하면 후원자 결제가 진행되지
                  않습니다.
                </li>
                <li>
                  후원 취소 및 결제 누락을 대비해 10% 이상 초과 달성을 목표로
                  해주세요.
                </li>
                <li>
                  제작비, 선물 배송비, 인건비, 예비 비용 등을 함께 고려해주세요.
                </li>
              </ul>
              <div className={classes.value_input}>
                <Form.Control
                  className={classes.title_input}
                  type="text"
                  placeholder="목표금액(숫자만)"
                  pattern="[0-9]*"
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseInt(e.target.value))}
                />
                <span>원</span>
              </div>
            </Form.Group>
          </div>
          <hr></hr>

          <div
            className={classes.item_container}
            ref={StoryAreaRef}
          >
            <div className={classes.story_area}>
              <h1>썸네일</h1>
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
              <h1>콘텐츠 썸네일</h1>
              <p>콘텐츠 썸네일 사진을 업로드해주세요.</p>
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
              <h1>펀딩 스토리</h1>
              <p>무엇을 만들기 위한 프로젝트인지 분명히 알려주세요.</p>
              <ul className={classes.guide}>
                <li className={classes.guide_bold}>
                  <GoInfo className={classes.guide_svg}></GoInfo>
                  스토리 작성 TIP
                </li>
                <li>
                  이미지로만 구성된 스토리는 이미지 로딩 속도가 느려 방문자가
                  상세 페이지를 벗어날 확률이 높아져요.
                </li>
                <li>
                  아래의 질문에 대한 답이 내용에 포함되도록 작성해보세요.
                </li>
                <li>Q. 무엇을 만들기 위한 펀딩인가요?</li>
                <li>Q. 펀딩을 간단히 소개한다면?</li>
                <li>Q. 이 펀딩이 왜 의미있나요?</li>
              </ul>
              <Editor
                onChange={(v) => {
                  setContent(v);
                }}
                value={content}
              />
            </div>
          </div>
          <hr></hr>

          <div
            className={classes.item_container}
            ref={RewardAreaRef}
          >
            <div>
              <RewardItemList
                onChange={(v) => {
                  setRewards(v);
                  console.log(v);
                }}
              />
            </div>
          </div>
          <hr></hr>
          <div
            className={classes.item_container}
            ref={MakerAreaRef}
          >
            <div className={classes.maker_area}>
              <h1>계좌연결</h1>
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
              >
                <option>은행명</option>
                <option value="1">기업</option>
                <option value="2">국민</option>
                <option value="3">신한</option>
              </Form.Select>
              <Form.Control
                className={classes.title_input}
                type="text"
                placeholder="계좌번호"
              />
            </div>

            <div className={classes.maker_area}>
              <h1>증명등록</h1>
              <p>
                증명등록에 필요한 파일을
                업로드해주세요.(주민등록증or사업자등록증)(인증서)
              </p>
              <Form.Control type="file" multiple />
            </div>
          </div>
        </div>
      </div>

      {
        /* <div>
        <NavLink to={"/fundings"}>
          <Button
            variant="success"
            onClick={() => {
              sendRequest();
            }}
          >
            완료
          </Button>
        </NavLink>
   </div> */
      }
    </>
  );
  async function sendRequest() {
    const url = new URL("/api/v1/fundings/request", window.location.href);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("thumbnail", thumbnail[0]);
    [...contentThumbnails].forEach((file) => {
      formData.append("content_thumbnail", file);
    });
    formData.append("content", content);
    formData.append("target_value", parseInt(targetValue));
    formData.append("begin_date", startDate.toISOString());
    formData.append("end_date", endDate.toISOString());
    formData.append("tags", tagSelected.toString());
    formData.append("rewards", JSON.stringify(rewards));

    const r = await fetch(url.href, {
      method: "POST",
      body: formData,
    });

    if (r.status === 201) {
      // TODO(vi117): toast 띄우기.
      alert("요청이 접수되었습니다.");
      navigate("/fundings");
    } else {
      alert("요청이 실패되었습니다.");
    }
  }
};

export default FundingsWrite;
