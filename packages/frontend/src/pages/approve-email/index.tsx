import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyUserEmail } from "../../api/user";
import { useAlertModal } from "../../hook/useAlertModal";
import classes from "./approve.module.css";

export default function ApproveEmailPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, _] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const navigate = useNavigate();
  const { showAlertModal, AlertModal } = useAlertModal();

  return (
    <div className={classes["container"]}>
      <AlertModal />
      <h3>코드 입력</h3>
      <p>
        입력된 코드를 바로 전송해주세요.
      </p>
      <div className={classes["FloatingLabel"]}>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </FloatingLabel>
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => verifyPassword(code)}
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
  async function verifyPassword(code: string) {
    try {
      await verifyUserEmail(code);
      await showAlertModal(
        "Success",
        "인증 단계가 완료되었습니다. 로그인해주세요.",
      );
      navigate("/login");
    } catch {
      console.log("error");
      await showAlertModal(
        "Error",
        "인증 단계가 완료되지 않았습니다. 다시 시도해주세요.",
      );
      return;
    }
  }
}

/*http://localhost:5173/forgot-password*/
