import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { APIError } from "../../api/error";
import { sendResetPassword } from "../../api/user";
import { useAlertModal } from "../../hook/useAlertModal";
import classes from "./forgot.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState();
  const { showAlertModal, AlertModal } = useAlertModal();

  return (
    <div className={classes["container"]}>
      <AlertModal />
      <h3>비밀번호 찾기</h3>
      <p>
        가입하신 이메일 주소를 입력하시면 <br></br>
        <strong>'비밀번호 재설정'</strong> 안내 메일이 전송됩니다.
      </p>
      <div className={classes["FloatingLabel"]}>
        <FloatingLabel
          controlId="floatingInput"
          label="이메일을 입력해주세요"
        >
          <Form.Control
            className={classes["mb-3"]}
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>
        <div className={classes["forgot_button"]}>
          <button onClick={forgetPassword}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
  async function forgetPassword() {
    try {
      await sendResetPassword(email);
      await showAlertModal("Success", "메일을 전송했습니다.");
    } catch (error) {
      if (error instanceof APIError) {
        await showAlertModal("Fail", error.message);
      } else {
        throw error;
      }
    }
  }
}

/*http://localhost:5173/forgot-password*/
