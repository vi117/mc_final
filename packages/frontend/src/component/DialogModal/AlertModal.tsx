import { Modal } from "react-bootstrap";
import { Button } from "../Button";

export default function AlertModal({
  showModal,
  title,
  msg,
  onHide,
}: {
  showModal: boolean;
  title: string;
  msg: string;
  onHide: () => void;
}) {
  return (
    <Modal
      centered
      show={showModal}
      onHide={onHide}
    >
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {msg}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onHide}
        >
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
