import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/user";
import { GOOGLE_APP_CLIENT_ID } from "../../config";
import classes from "./style.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function onLoginClick() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [success, _v] = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      // TODO(vi117): use modal to show error
      alert("로그인에 실패했습니다.");
      setPassword("");
    }
  }

  return (
    <div className={classes["login-container"]}>
      <div className={classes["login-wrapper"]}>
        <h1>Login</h1>
        <Form
          className={classes["login-form"]}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Form.Group className="mb-1">
            <Form.Label style={{ fontSize: "12px" }}>이메일</Form.Label>
            <Form.Control
              type="email"
              className="login-form-input"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label style={{ fontSize: "12px" }}>비밀번호</Form.Label>
            <Form.Control
              className="login-form-input"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="d-flex justify-content-between mb-3">
            <div
              className="d-flex"
              style={{ gap: "5px", justifyContent: "baseline" }}
            >
            </div>
            <NavLink
              to="/forgot-password"
              className={classes["login-form-forgot"]}
            >
              아이디/비밀번호 찾기
            </NavLink>
          </Form.Group>
          <Button
            onClick={onLoginClick}
            type="submit"
            className={classes["login-form-button"]}
          >
            Login
          </Button>
        </Form>

        <SNSLogin />
        <div className={classes["register_container"]}>
          아직 Happytails 계정이 없으신가요?
          <NavLink to={"/register"} className={classes["register_link"]}>
            회원가입
          </NavLink>
        </div>
      </div>
    </div>
  );
}

function SNSLogin() {
  return (
    <div>
      <p className={classes["sns_login_phrase"]}>간편하게 SNS 로그인</p>

      <div className={classes["sns_login_container"]}>
        <button
          onClick={() => {
            const url = new URL(
              "https://accounts.google.com/o/oauth2/v2/auth",
            );
            url.searchParams.set(
              "client_id",
              GOOGLE_APP_CLIENT_ID,
            );
            url.searchParams.set(
              "redirect_uri",
              "http://localhost:5173/google-login",
            );
            url.searchParams.set("response_type", "code");
            url.searchParams.set("scope", "email profile openid");
            window.location = url.href;
          }}
          className={classes["sns_login_button"]}
        >
          <GoogleSvg />
        </button>
        {/* <!-- 카카오 --> */}
        <button className={classes["sns_login_button"]}>
          <div className="">
            <KakaoSvg />
          </div>
        </button>

        <button className={classes["sns_login_button"]}>
          <div className="">
            <NaverSvg />
          </div>
        </button>
      </div>
    </div>
  );
}

function KakaoSvg() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="14.875" fill="#FEE500"></circle>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.0002 9.03125C12.0901 9.03125 8.146 12.0938 8.146 15.8415C8.30698 18.4205 9.91683 20.6369 12.2511 21.604L11.4059 24.6666C11.3657 24.7472 11.4059 24.8681 11.4864 24.908C11.5669 24.989 11.7279 24.989 11.8084 24.908L15.3903 22.5309C15.9135 22.6115 16.4367 22.6518 17.0002 22.6518C21.87 22.6518 25.8543 19.5892 25.8543 15.8415C25.8543 12.0938 21.9102 9.03125 17.0002 9.03125Z"
        fill="black"
        fillOpacity="0.9"
      >
      </path>
    </svg>
  );
}

function NaverSvg() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <g clipPath="url(#clip0_226_6574)">
        <path
          d="M17 31.875C8.81875 31.875 2.125 25.1812 2.125 17C2.125 8.81875 8.81875 2.125 17 2.125C25.1812 2.125 31.875 8.81875 31.875 17C31.875 25.1812 25.1812 31.875 17 31.875Z"
          fill="#03C75A"
        >
        </path>
        <path
          d="M18.9338 17.3825L14.9105 11.6167H11.5742V22.3834H15.0663V16.6175L19.0896 22.3834H22.4259V11.6167H18.9338V17.3825Z"
          fill="white"
        >
        </path>
      </g>
      <defs>
        <rect
          width="29.75"
          height="29.75"
          fill="white"
          transform="translate(2.125 2.125)"
        >
        </rect>
      </defs>
    </svg>
  );
}

function GoogleSvg() {
  // Generator: Sketch 3.3.3 (12081) - http://www.bohemiancoding.com/sketch
  return (
    <svg
      width="34px"
      height="34px"
      viewBox="0 0 46 46"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ backgroundColor: "#F0F0F0", borderRadius: "50%" }}
    >
      <title>btn_google_light_normal_ios</title>
      <desc>Created with Sketch.</desc>
      <defs>
        <filter
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
          id="filter-1"
        >
          <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1">
          </feOffset>
          <feGaussianBlur
            stdDeviation="0.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          >
          </feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0"
            in="shadowBlurOuter1"
            type="matrix"
            result="shadowMatrixOuter1"
          >
          </feColorMatrix>
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2">
          </feOffset>
          <feGaussianBlur
            stdDeviation="0.5"
            in="shadowOffsetOuter2"
            result="shadowBlurOuter2"
          >
          </feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0"
            in="shadowBlurOuter2"
            type="matrix"
            result="shadowMatrixOuter2"
          >
          </feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
      </defs>
      <g
        id="Google-Button"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        sketch:type="MSPage"
      >
        <g
          id="9-PATCH"
          sketch:type="MSArtboardGroup"
          transform="translate(-608.000000, -160.000000)"
        >
        </g>
        <g
          id="btn_google_light_normal"
          sketch:type="MSArtboardGroup"
          transform="translate(-1.000000, -1.000000)"
        >
          <g
            id="button"
            sketch:type="MSLayerGroup"
            transform="translate(4.000000, 4.000000)"
            filter="url(#filter-1)"
          >
            <g id="button-bg">
              <use
                fill="#FFFFFF"
                fillRule="evenodd"
                sketch:type="MSShapeGroup"
                xlinkHref="#path-2"
              >
              </use>
              <use fill="none" xlinkHref="#path-2"></use>
              <use fill="none" xlinkHref="#path-2"></use>
              <use fill="none" xlinkHref="#path-2"></use>
            </g>
          </g>
          <g
            id="logo_googleg_48dp"
            transform="translate(15.000000, 15.000000)"
          >
            <path
              d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
              id="Shape"
              fill="#4285F4"
              sketch:type="MSShapeGroup"
            >
            </path>
            <path
              d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
              id="Shape"
              fill="#34A853"
              sketch:type="MSShapeGroup"
            >
            </path>
            <path
              d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
              id="Shape"
              fill="#FBBC05"
              sketch:type="MSShapeGroup"
            >
            </path>
            <path
              d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
              id="Shape"
              fill="#EA4335"
              sketch:type="MSShapeGroup"
            >
            </path>
            <path
              d="M0,0 L18,0 L18,18 L0,18 L0,0 Z"
              id="Shape"
              sketch:type="MSShapeGroup"
            >
            </path>
          </g>
          <g id="handles_square" sketch:type="MSLayerGroup"></g>
        </g>
      </g>
    </svg>
  );
}
