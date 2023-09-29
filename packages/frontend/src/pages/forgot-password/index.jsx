import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { send_reset_password } from "../../api/user";
import classes from "./forgot.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState();

  return (
    <div className={classes["container"]}>
      <h3>비밀번호 찾기</h3>
      <p>
        가입하신 이메일 주소를 입력하시면 <br></br>
        <strong>'비밀번호 재설정'</strong> 안내 메일이 전송됩니다.
      </p>
      <div className={classes["FloatingLabel"]}>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>
        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" onClick={forgetPassword}>
            전송
          </Button>
        </div>
      </div>
    </div>
  );
  async function forgetPassword() {
    const res = await send_reset_password(email);
    if (!res.ok) {
      console.log("error!");
    }
    console.log("success");
    // TODO(vi117): 모달을 띄우도록 함.
  }
}

/*http://localhost:5173/forgot-password*/
