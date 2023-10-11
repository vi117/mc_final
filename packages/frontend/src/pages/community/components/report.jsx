import { useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { reportArticle } from "../../../api/mod";
import classes from "../styles/Co_detail.module.css";

function CommunityReport({
  article_id,
}) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        className={classes["reportbtn"]}
        onClick={handleShow}
      >
        신고
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold", marginLeft: "10px" }}>
            커뮤니티 신고
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
              <option value="이득을 취할 목적으로 작성한 글">
                이득을 취할 목적으로 작성한 글
              </option>
              <option value="커뮤니티 운영원칙 위반">
                커뮤니티 운영원칙 위반
              </option>
              <option value="개인정보 보호 권리 침해">
                개인정보 보호 권리 침해
              </option>
              <option value="홍보">
                직/간접적 상품, 서비스, 사이트, 앱 등 홍보
              </option>
              <option value="음란성/선정성 이미지, 영상, 텍스트 등의 콘텐츠">
                음란성/선정성 이미지, 영상, 텍스트 등의 콘텐츠
              </option>
              <option value="기타">기타/ 자세한 사유를 기재해주세요</option>
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
      await reportArticle(article_id, `# ${category}\n${content}`);
      alert("신고완료");
    } catch (error) {
      console.log(error);
      alert("전송실패");
    }
  }
}

export default CommunityReport;
