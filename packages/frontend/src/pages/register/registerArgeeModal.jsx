import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TermOfPolicy from "./TermOfPolicy";

function RegisterArgee(props) {
  const {
    show,
    handleClose,
    handleConfirm,
    ...rest
  } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      {...rest}
    >
      <Modal.Header closeButton>
        <Modal.Title>회원가입 약관</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TermOfPolicy></TermOfPolicy>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleConfirm}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RegisterArgee;
