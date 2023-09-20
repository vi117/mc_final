import { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useSearchParams } from "react-router-dom";

async function googleLogin(code: string) {
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
    return null;
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
        return;
      }
      googleLogin(code).then((res) => {
        if (res === null) {
          console.log("internal server error");
          return;
        }
        if (res.message === "success") {
          navigate("/login");
        } else {
          navigate("/register", {
            state: res,
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
