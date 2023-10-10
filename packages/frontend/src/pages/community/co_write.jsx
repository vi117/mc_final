import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { Editor } from "../../component/Editor";
import { ANIMAL_CATEGORY } from "./constant";
import baseClasses from "./styles/Co_base.module.css";
import classes from "./styles/Co_write.module.css";
import "./styles/tags.css";
import Cowritemodal from "./components/co_writemodal";
import "./styles/editor.css";
import { GoArrowLeft } from "react-icons/go";
import { postArticle } from "../../api/article";
import { Container } from "../../component";
import { useAlertModal } from "../../hook/useAlertModal";

const selectList = ANIMAL_CATEGORY.map((v) => ({
  value: v,
}));

const TagWrite = ({
  selected,
  onChange,
}) => {
  return (
    <div>
      <TagsInput
        value={selected}
        onChange={onChange}
        placeHolder={selected.length === 0
          ? "태그를 입력해주세요"
          : ""}
      />
    </div>
  );
};

const CommunityWrite = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagSelected, setSelected] = useState(["QnA"]);
  const [showModal, setShowModal] = useState(true);
  const [reviewedFunding, setReviewedFunding] = useState(undefined);
  const { AlertModal, showAlertModal } = useAlertModal();

  const backToList = () => {
    const userConfirmed = window.confirm(
      "지금까지 작성한 내용이 모두 사라집니다.",
    );

    if (userConfirmed) {
      navigate("/community");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCategory(value);
    }
  };

  return (
    <Container>
      <AlertModal />
      {
        <Cowritemodal
          show={showModal}
          handleClose={() => {
            setShowModal(false);
            setReviewedFunding(undefined);
          }}
          handleSelect={(reviewedFunding) => {
            setReviewedFunding(reviewedFunding);
            setShowModal(false);
          }}
        >
        </Cowritemodal>
      }
      <div className={classes["write-wrap"]}>
        <div>
          <div className={classes["write-header"]}>
          </div>

          <Form.Select
            className={classes["catSelect"]}
            onChange={onChange}
            name="category"
            value={category}
          >
            <option className={classes["d-none"]} value="">
              카테고리를 선택해주세요
            </option>
            {selectList.map((item) => (
              <option
                value={item.value}
                key={item.value}
              >
                {item.value}
              </option>
            ))}
          </Form.Select>

          <h1 className={baseClasses["co_h1"]}>
            태그 입력
          </h1>
          <div className={baseClasses["co_tagarea"]}>
            <TagWrite selected={tagSelected} onChange={setSelected} />
          </div>
          <h1 className={baseClasses["co_h1"]}>펀딩 후기 작성하기</h1>
          <div
            className={baseClasses["co_input"]}
            onClick={() => setShowModal(true)}
          >
            {reviewedFunding
              ? reviewedFunding.title
              : "선택하려면 클릭해주세요."}
          </div>

          <h1 className={baseClasses["co_h1"]}>커뮤니티 글 작성</h1>
          <input
            className={baseClasses["co_input"]}
            type="text"
            name="title"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className={baseClasses["co_textarea"]}>
            <Editor
              className={baseClasses["co_editor"]}
              onChange={(v) => {
                setContent(v);
              }}
              value={content}
            />
          </div>
        </div>
        <div className={classes["submitbutton"]}>
          <button onClick={backToList}>
            <GoArrowLeft className={classes["create_svg"]}>
            </GoArrowLeft>돌아가기
          </button>
          <button onClick={sendRequest}>글 등록</button>
        </div>
      </div>
    </Container>
  );

  async function sendRequest() {
    if (title === "") {
      await showAlertModal("fail", "제목을 입력해주세요.");
      return;
    }
    if (category === "") {
      await showAlertModal("fail", "카테고리를 선택해야 합니다.");
      return;
    }

    try {
      await postArticle({
        title,
        content,
        category,
        reviewedFundingId: reviewedFunding?.id,
      });
      await showAlertModal("success", "요청이 접수되었습니다.");
      navigate("/community");
    } catch (e) {
      console.log(e);
      await showAlertModal("fail", "요청이 실패했습니다.");
    }
  }
};

export default CommunityWrite;
