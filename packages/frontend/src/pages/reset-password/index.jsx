import clsx from "clsx";
import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword as resetPasswordAPI } from "../../api/mod";
import { Button } from "../../component/Button";
import { useAlertModal } from "../../hook/useAlertModal";
import classes from "./reset-password.module.css";

export default function ResetpasswordPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [param, _] = useSearchParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { AlertModal, showAlertModal } = useAlertModal();

  return (
    <div className={classes["resetpw_container"]}>
      <AlertModal />
      <h3>비밀번호 재설정</h3>
      <p>사용하실 비밀번호를 설정해주세요.</p>
      <div className={classes["FloatingLabel"]} style={{ marginTop: "100px" }}>
        <FloatingLabel
          controlId="floatingInput"
          label="비밀번호"
        >
          <Form.Control
            className={classes["reset_form"]}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingPassword"
          label="비밀번호 확인"
        >
          <Form.Control
            type="password"
            className={classes["reset_form"]}
            placeholder="Password-check"
          />
        </FloatingLabel>

        <div className={"d-flex mb-3 w-100"}>
          <Button
            className={clsx("me-auto w-100", classes["button"])}
            variant="contained"
            size="lg"
            onClick={resetPassword}
          >
            설정 완료
          </Button>
        </div>
      </div>
    </div>
  );

  async function resetPassword() {
    const code = param.get("code");
    try {
      await resetPasswordAPI(password, code ?? undefined);
    } catch (error) {
      await showAlertModal("reset password error", error.message);
      return;
    }
    // redirect
    navigate("/login");
  }
}

/*http://localhost:5173/reset-password*/
