import { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useSearchParams } from "react-router-dom";

async function googleLogin(code: string): Promise<{
  message: string;
  code:
    | "need_signup"
    | "success"
    | "invalid_request"
    | "token_error"
    | "payload_error";
  data?: {
    token: string;
    email: string;
    name: string;
  };
}> {
  const res = await fetch("/api/v1/users/google-login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  if (!res.ok) {
    return await res.json();
  }
  const resJson = await res.json();
  return resJson;
}

const usedCode = new Set();

export function GoogleLogin() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [params, _setParams] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get("code");
  useEffect(() => {
    if (code) {
      if (usedCode.has(code)) {
        console.log("already used");
        return;
      }
      googleLogin(code).then((res) => {
        if (
          res.code === "invalid_request" || res.code === "token_error"
          || res.code === "payload_error"
        ) {
          console.log("internal server error");
          return;
        }
        if (res.code === "success") {
          navigate("/");
        } else {
          navigate("/register", {
            state: res.data,
          });
        }
      }).finally(() => {
        usedCode.add(code);
      });
    }
  }, [code, navigate]);

  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
