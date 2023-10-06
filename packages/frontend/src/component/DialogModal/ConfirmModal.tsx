import { Button, Modal } from "react-bootstrap";

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
          Confirm
        </Button>
        <Button
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
