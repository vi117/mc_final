import { useEffect, useState } from "react";

const login_event_target = new EventTarget();

interface UserInfo {
  id: number;
  nickname: string;
  address: string;
  phone: string;
  email: string;
  is_admin?: boolean;
}
function getLoginUser(): UserInfo | null {
  const cookiesStr = document.cookie;
  const cookies = cookiesStr.split(";");
  const cookiesObj = cookies.map((cookie) => {
    const [cookieName, cookieValue] = cookie.split("=").map((v) => v.trim());
    return { cookieName, cookieValue };
  }).filter(({ cookieName }) => {
    return cookieName === "login_user_id";
  });
  if (cookiesObj.length > 0) {
    try {
      const value = decodeURIComponent(cookiesObj[0].cookieValue);
      return JSON.parse(value);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  return null;
}

export function useLoginInfo() {
  // TODO(vi117): For react 18, use `usesyncExternalstore`
  const [loginUser, setLoginUser] = useState(getLoginUser());
  useEffect(() => {
    const handler = () => {
      console.log("revalidate");
      setLoginUser(getLoginUser());
    };
    login_event_target.addEventListener("revalidate", handler);
    return () => {
      login_event_target.removeEventListener("revalidate", handler);
    };
  });
  return loginUser;
}

export function useLoginId(): number | null {
  const loginUser = useLoginInfo();
  return loginUser?.id ?? null;
}

export function loginRevalidate() {
  login_event_target.dispatchEvent(new Event("revalidate"));
}
