import { Button, FloatingLabel, Form } from "react-bootstrap";
import classes from "./reset-password.module.css";

export default function ResetpasswordPage() {
  return (
    <div className={classes["container"]}>
      <h3>비밀번호 재설정</h3>
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
          <Form.Control type="email" placeholder="name@example.com" />
        </FloatingLabel>
        <div className="d-grid gap-2">
          <Button variant="primary" size="lg">
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}

/* http://localhost:5173/reset-password */
