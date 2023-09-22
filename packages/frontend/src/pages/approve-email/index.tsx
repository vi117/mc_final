import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import classes from "./approve.module.css";

export default function ApproveEmailPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, _] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const navigate = useNavigate();

  return (
    <div className={classes["container"]}>
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
            type="email"
            placeholder="name@example.com"
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
    const res = await fetch("/api/v1/users/verify", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        code: code,
      }),
    });
    if (!res.ok) {
      console.log("error!");
    }
    // TODO(vi117): 모달을 띄우도록 함.
    alert("success");
    console.log("success");
    navigate("/login");
  }
}

/*http://localhost:5173/forgot-password*/
