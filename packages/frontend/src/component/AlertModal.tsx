import { Button, Modal } from "react-bootstrap";

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
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
