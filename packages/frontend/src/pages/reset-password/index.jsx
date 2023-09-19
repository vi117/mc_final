import { Button, FloatingLabel, Form } from "react-bootstrap";
import classes from "./reset-password.module.css";

export default function ResetpasswordPage() {
  return (
    <div className={classes["container"]}>
      <h3>비밀번호 재설정</h3>
      <p>사용하실 비밀번호를 설정해주세요.</p>
      <div className={classes["FloatingLabel"]}>
        <FloatingLabel
          controlId="floatingInput"
          label="Password"
          className="mb-3"
        >
          <Form.Control type="password" placeholder="password" />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password-check">
          <Form.Control type="password" placeholder="Password-check" />
        </FloatingLabel>
        <br></br>
        <div className="d-grid gap-2">
          <Button variant="primary" size="lg">
            설정 완료
          </Button>
        </div>
      </div>
    </div>
  );
}

/*http://localhost:5173/reset-password*/
