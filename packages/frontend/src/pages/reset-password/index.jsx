import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import classes from "./reset-password.module.css";

export default function ResetpasswordPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [param, _] = useSearchParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
          <Form.Control
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password-check">
          <Form.Control type="password" placeholder="Password-check" />
        </FloatingLabel>
        <br></br>
        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" onClick={resetPassword}>
            설정 완료
          </Button>
        </div>
      </div>
    </div>
  );
  async function resetPassword() {
    const code = param.get("code");
    const res = await fetch("/api/v1/users/reset-password", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        code,
        password,
      }),
    });
    if (!res.ok) {
      // TODO(vi117): 나중에 적당한 경고창 띄우기.
      console.log("error");
      return;
    }
    console.log("success");
    // redirect
    navigate("/login");
  }
}

/*http://localhost:5173/reset-password*/
