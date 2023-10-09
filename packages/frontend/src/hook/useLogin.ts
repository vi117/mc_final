import { useEffect, useState } from "react";

const login_event_target = new EventTarget();

export interface UserInfo {
  id: number;
  nickname: string;
  address: string;
  phone: string;
  email: string;
  is_admin?: boolean;
  address_detail: string;
  introduction?: string;
  profile_image?: string;
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

/**
 * This function is a custom React hook that retrieves the login information of the user.
 *
 * @param {Object} options - An optional object containing the following properties:
 *   - interval: The interval in milliseconds at which the login information should be updated.
 *               Default is 10000 milliseconds (10 seconds).
 *               if interval is 0 or less, the login information will not be updated.
 *   - updateWhenFocus: Whether the login information should be updated when the user focuses on window. Default is true.
 * @example
 * ```js
 * const userInfo = useLoginInfo();
 *
 * console.log(userInfo.is_admin);
 * console.log(userInfo.email);
 * ```
 * @return {UserInfo | null} The login information of the user.
 */
export function useLoginInfo({
  interval = 1000 * 10,
  updateWhenFocus = true,
} = {}) {
  // TODO(vi117): For react 18, use `usesyncExternalstore`
  const [loginUser, setLoginUser] = useState(getLoginUser());
  useEffect(() => {
    const handler = () => {
      console.log("revalidate");
      const newLoginUser = getLoginUser();
      if (newLoginUser?.id !== loginUser?.id) {
        setLoginUser(newLoginUser);
      }
    };
    login_event_target.addEventListener("revalidate", handler);
    let timerId: number | undefined;
    if (interval > 0) {
      timerId = setInterval(handler, interval);
    }
    if (updateWhenFocus) {
      window.addEventListener("focus", handler);
    }
    return () => {
      login_event_target.removeEventListener("revalidate", handler);
      if (timerId) {
        clearInterval(timerId);
      }
      if (updateWhenFocus) {
        window.removeEventListener("focus", handler);
      }
    };
  }, [loginUser, interval, updateWhenFocus]);
  return loginUser;
}

export function useLoginId(): number | null {
  const loginUser = useLoginInfo();
  return loginUser?.id ?? null;
}

export function loginRevalidate() {
  login_event_target.dispatchEvent(new Event("revalidate"));
}
