import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function PromptModal({
  showModal,
  title,
  msg,
  placeholder = "Enter the text",
  onConfirm,
  onCancel,
}: {
  showModal: boolean;
  title: string;
  msg: string;
  placeholder?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = useState("");
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
        <Form>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            onConfirm(value);
          }}
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
