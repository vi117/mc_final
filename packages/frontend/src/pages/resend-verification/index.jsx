import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { APIError } from "../../api/error";
import { resendVerification } from "../../api/user";
import { useAlertModal } from "../../hook/useAlertModal";
import classes from "./resend.module.css";

export default function ResendVerificationPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const { showAlertModal, AlertModal } = useAlertModal();

  return (
    <div className={classes["container"]}>
      <AlertModal />
      <h3>이메일 인증 다시 보내기</h3>
      <p>
        가입하신 이메일을 입력하시면 <br></br>
        <strong>'이메일 인증'</strong> 안내 메일이 다시 전송됩니다.
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
        <div className={classes["button"]}>
          <button onClick={forgetPassword}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
  async function forgetPassword() {
    try {
      await resendVerification(email);
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
