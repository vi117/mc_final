import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Agreement, TermOfPolicy } from "./TermOfPolicy";

function RegisterArgee(props: {
  show: boolean;
  handleClose: () => void;
  handleConfirm: (agreements: Agreement) => void;
}) {
  const {
    show,
    handleClose,
    handleConfirm,
    ...rest
  } = props;
  const [agreements, setAgreements] = useState<Agreement>({
    termsAgreed: false,
    personallnfoAgreed: false,
    provisionAgreed: false,
    locationAgreed: false,
    eventAlarmAgreed: false,
    serviceAlarmAgreed: false,
  });

  const requiredAgreements = [
    "termsAgreed",
    "personallnfoAgreed",
    "provisionAgreed",
  ] satisfies (keyof Agreement)[];
  const isRequiredFilled = requiredAgreements.every(
    (key) => agreements[key],
  );

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
        <TermOfPolicy onChange={setAgreements}></TermOfPolicy>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleConfirm(agreements);
          }}
          disabled={!isRequiredFilled}
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RegisterArgee;
