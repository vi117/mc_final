import { Modal } from "react-bootstrap";
import { Button } from "../Button";

export default function ConfirmModal({
  showModal,
  title,
  msg,
  onConfirm,
  onCancel,
}: {
  showModal: boolean;
  title: string;
  msg: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      centered
      show={showModal}
      onHide={onCancel}
    >
      <Modal.Header closeButton onHide={onCancel}>
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
          onClick={onConfirm}
        >
          네
        </Button>
        <Button
          onClick={onCancel}
        >
          아니오
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
