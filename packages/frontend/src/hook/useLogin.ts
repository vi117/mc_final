import { useEffect, useState } from "react";

const login_event_target = new EventTarget();

function getLoginUserId() {
  const cookiesStr = document.cookie;
  const cookies = cookiesStr.split(";");
  const cookiesObj = cookies.map((cookie) => {
    const [cookieName, cookieValue] = cookie.split("=");
    return { cookieName, cookieValue };
  }).filter(({ cookieName }) => {
    return cookieName === "login_user_id";
  });
  if (cookiesObj.length > 0) {
    return parseInt(cookiesObj[0].cookieValue);
  }
  return null;
}

export function useLogin() {
  const [loginUser, setLoginUser] = useState(getLoginUserId());
  useEffect(() => {
    const handler = () => {
      console.log("revalidate");
      setLoginUser(getLoginUserId());
    };
    login_event_target.addEventListener("revalidate", handler);
    return () => {
      login_event_target.removeEventListener("revalidate", handler);
    };
  });
  return loginUser;
}

export function loginRevalidate() {
  login_event_target.dispatchEvent(new Event("revalidate"));
}
