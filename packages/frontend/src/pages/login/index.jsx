import { NavLink } from "react-router-dom";
import classes from "./style.module.css";

export default function LoginPage() {
  return (
    <div className={classes["login-container"]}>
      <div className={classes["login-wrapper"]}>
        <h1>Login</h1>
        <form
          className={classes["login-form"]}
        >
          <input type="text" name="userName" placeholder="Email" />
          <input type="password" name="userPassword" placeholder="Password" />
          <label htmlFor="remember-check">
            <input type="checkbox" id="remember-check"></input> 자동 로그인
          </label>
          <span>
            <a href="아이디/비밀번호 찾기.url">아이디/비밀번호 찾기</a>
          </span>
          <NavLink to={"/"}>
            <input
              type="submit"
              value="Login"
              className={classes["login-form-input"]}
            />
          </NavLink>
        </form>

        <div className={classes["lfmFQa"]}>
          <div className={classes["eiCjYy"]}></div>
          <p>간편하게 SNS 로그인</p>
          {/* <!-- 카카오 --> */}
          <button className={classes["fmrIwS"]}>
            <div className="">
              <KakaoSvg />
            </div>
          </button>

          <button className={classes["fmrIwS"]}>
            <div className="">
              <NaverSvg />
            </div>
          </button>

          {/* <!--페이스북 --> */}
          <button className={classes["fmrIwS"]}>
            <div className="Icon__SVGICON-sc-1xkf9cp-0 ccxeYs SocialMembershipMenu__StyledSVGIcon-sc-141itvp-2 cypxet">
              <FacebookSvg />
            </div>
          </button>

          {/*  애플  */}
          <button className={classes["fmrIwS"]}>
            <div className="">
              <AppleSvg />
            </div>
            <div id="appleid-signin" data-type="sign-in">
            </div>
          </button>

          <div className={classes["bQAztb"]}>
            아직 Happytails 계정이 없으신가요?
            <span
              color="sub0180"
              font-weight="500"
              className={classes["bKXWde"]}
            >
              <strong>
                <NavLink to={"/register"}>
                  회원가입
                </NavLink>
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
function KakaoSvg() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="14.875" fill="#FEE500"></circle>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.0002 9.03125C12.0901 9.03125 8.146 12.0938 8.146 15.8415C8.30698 18.4205 9.91683 20.6369 12.2511 21.604L11.4059 24.6666C11.3657 24.7472 11.4059 24.8681 11.4864 24.908C11.5669 24.989 11.7279 24.989 11.8084 24.908L15.3903 22.5309C15.9135 22.6115 16.4367 22.6518 17.0002 22.6518C21.87 22.6518 25.8543 19.5892 25.8543 15.8415C25.8543 12.0938 21.9102 9.03125 17.0002 9.03125Z"
        fill="black"
        fill-opacity="0.9"
      >
      </path>
    </svg>
  );
}

function NaverSvg() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <g clip-path="url(#clip0_226_6574)">
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

function FacebookSvg() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path
        d="M17 31.875C8.81875 31.875 2.125 25.1812 2.125 17C2.125 8.81875 8.81875 2.125 17 2.125C25.1812 2.125 31.875 8.81875 31.875 17C31.875 25.1812 25.1812 31.875 17 31.875Z"
        fill="#1877F2"
      >
      </path>
      <path
        d="M27.625 16.9945C27.625 11.1325 22.8651 6.375 17 6.375C11.1349 6.375 6.375 11.1325 6.375 16.9945C6.375 22.2988 10.2595 26.6954 15.3477 27.4828V20.0568H12.634V16.9945H15.3477V14.6541C15.3477 11.9965 16.9234 10.52 19.3526 10.52C20.5125 10.52 21.7161 10.7387 21.7161 10.7387V13.3307H20.3812C19.0572 13.3307 18.6413 14.1619 18.6413 14.9931V16.9836H21.5958L21.1253 20.0459H18.6413V27.4719C23.7405 26.6954 27.625 22.2988 27.625 16.9945Z"
        fill="#1877F2"
      >
      </path>
      <path
        d="M21.1361 20.0676L21.6067 17.0053H18.6522V15.0148C18.6522 14.1727 19.079 13.3524 20.3921 13.3524H21.727V10.7495C21.727 10.7495 20.5234 10.5308 19.3635 10.5308C16.9343 10.5308 15.3586 12.0072 15.3586 14.6648V17.0053H12.6449V20.0676H15.3586V27.4936C15.8948 27.5811 16.4528 27.6248 17.0109 27.6248C17.5689 27.6248 18.127 27.5811 18.6632 27.4936V20.0676H21.1361Z"
        fill="white"
      >
      </path>
    </svg>
  );
}

function AppleSvg() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="14.875" fill="black"></circle>
      <path
        d="M17.1893 12.0962C17.8965 12.0962 18.783 11.6206 19.3109 10.9866C19.7891 10.412 20.1377 9.60956 20.1377 8.80711C20.1377 8.69813 20.1277 8.58916 20.1078 8.5C19.3209 8.52972 18.3746 9.02506 17.8068 9.68881C17.3586 10.1941 16.9502 10.9866 16.9502 11.799C16.9502 11.9178 16.9701 12.0367 16.9801 12.0763C17.0299 12.0862 17.1096 12.0962 17.1893 12.0962ZM14.699 24.0833C15.6652 24.0833 16.0936 23.4394 17.2988 23.4394C18.524 23.4394 18.793 24.0635 19.8688 24.0635C20.9246 24.0635 21.6318 23.0927 22.2992 22.1416C23.0463 21.0519 23.3551 19.9819 23.375 19.9324C23.3053 19.9126 21.2832 19.0903 21.2832 16.7821C21.2832 14.7809 22.877 13.8794 22.9666 13.81C21.9107 12.3042 20.307 12.2646 19.8688 12.2646C18.6834 12.2646 17.7172 12.9779 17.1096 12.9779C16.4521 12.9779 15.5855 12.3042 14.5596 12.3042C12.6072 12.3042 10.625 13.9091 10.625 16.9406C10.625 18.8228 11.3621 20.8141 12.2686 22.102C13.0455 23.1917 13.7229 24.0833 14.699 24.0833Z"
        fill="white"
      >
      </path>
    </svg>
  );
}
