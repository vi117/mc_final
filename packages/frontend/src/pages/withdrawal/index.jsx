import classes from "./withdrawal.module.css";

import { styled } from "@mui/material";
import { Alert, Button, Form } from "react-bootstrap";

export function BasicExample() {
  return (
    <>
      {[
        "danger",
      ].map((variant) => (
        <Alert key={variant} variant={variant}>
          This is a {variant} alert—check it out!
        </Alert>
      ))}
    </>
  );
}

export function FormTextExample() {
  return (
    <>
      <Form.Label htmlFor="inputPassword5">Password</Form.Label>
      <Form.Control
        type="password"
        id="inputPassword5"
        aria-describedby="passwordHelpBlock"
      />
      <Form.Text id="passwordHelpBlock" muted>
        Your password must be 8-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </Form.Text>
    </>
  );
}

export function CheckExample() {
  return (
    <Form>
      {["checkbox"].map((type) => (
        <div key={`default-${type}`} className="mb-3">
          <Form.Check // prettier-ignore
            type={type}
            id={`default-${type}`}
            label={`default ${type}`}
          />
          탈퇴 후 복구 불가함을 확인하였습니다.
        </div>
      ))}
    </Form>
  );
}

export function TypesExample() {
  return (
    <>
      <Button variant="secondary">Secondary</Button>{" "}
      <Button variant="secondary">Secondary</Button>
      {" "}
    </>
  );
}

const Foo = styled("Foo")({
  background: "gray",
  width: "50px",
  height: "50px",
});

export default function WithdrawalPage() {
  return (
    <div className={classes["container"]}>
      <h2>회원탈퇴</h2>
      <Alert variant="danger">
        탈퇴 시 전자금융거래법에 따라 금융 거래기록은 5년 뒤 파기됩니다. 다른
        모든 정보는 삭제되며 복구는 불가합니다.
      </Alert>
      <Button>cbc</Button>
      <Button>abc</Button>
      <Foo></Foo>
      <div></div>
    </div>
  );
}

/**
 * npm i vite-plugin-svgr
 *
 * vscode gitLens
 *
 * http://localhost:5173/withdraw
 *
 * fst(a,b) = a
 * snd(a,b) = b
 */
