import { FloatingLabel, Form } from "react-bootstrap";
import classes from "./reset-password.module.css";

export default function ResetpasswordPage() {
  return (
    <div className={classes["container"]}>
      <h3>비밀번호 재설정</h3>
      <div className={classes["FloatingLabel"]}>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control type="email" placeholder="name@example.com" />
        </FloatingLabel>
      </div>
    </div>
  );
}

/* http://localhost:5173/reset-password */
