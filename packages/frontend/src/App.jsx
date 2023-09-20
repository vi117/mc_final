import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./component/layout/Layout";

import "bootstrap/dist/css/bootstrap.min.css";

import CommunityDetail from "./pages/community/Co_detail";
import CommunityWrite from "./pages/community/Co_write";
import Community from "./pages/community/Community";
import FundingsDetail from "./pages/fundings/FundingsDetail";
import FundingsEdit from "./pages/fundings/FundingsEdit";
import FundingsHome from "./pages/fundings/FundingsHome";
import FundingsPay from "./pages/fundings/FundingsPay";
import FundingsSearch from "./pages/fundings/FundingsSearch";
import FundingsWrite from "./pages/fundings/FundingsWrite";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import WithdrawalPage from "./pages/withdrawal";

import ForgotPasswordPage from "./pages/forgot-password";
import RegisterPage from "./pages/register";
import ResetpasswordPage from "./pages/reset-password";

import { GoogleLogin } from "./pages/sns_login/google";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage></HomePage> },
      /**
       * About Page
       */
      { path: "/about", element: <h1>About</h1> },
      { path: "/contact", element: <h1>Contact</h1> },
      /**
       * 로그인 페이지
       */
      { path: "/login", element: <LoginPage /> },
      /**
       * 회원가입 페이지
       */
      { path: "/register", element: <RegisterPage /> },
      /**
       * 회원 탈퇴
       */
      { path: "/withdraw", element: <WithdrawalPage></WithdrawalPage> },
      /**
       * 비밀번호 찾기
       */
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage></ForgotPasswordPage>,
      },
      /**
       * 비밀번호 재설정
       */
      {
        path: "/reset-password",
        element: <ResetpasswordPage></ResetpasswordPage>,
      },
      /**
       * 접속한 유저의 프로필 홈
       */
      { path: "/profile", element: <h1>Profile</h1> },
      /**
       * 접속한 유저의 자기 프로필 수정
       */
      { path: "/profile/edit", element: <h1>Edit Profile</h1> },
      /**
       * 커뮤니티 홈
       */
      { path: "/community", element: <Community></Community> },
      /**
       * 커뮤니티 글
       */
      { path: "/community/:id", element: <CommunityDetail></CommunityDetail> },
      /**
       * 커뮤니티 글 수정 및 삭제
       */
      { path: "/community/:id/edit", element: <h1>Communityedit</h1> },
      /**
       * 커뮤니티 글 작성
       */
      {
        path: "/community/:id/post",
        element: <CommunityWrite></CommunityWrite>,
      },
      /**
       * 펀딩 홈
       */
      { path: "/fundings", element: <FundingsHome /> },
      /**
       * 펀딩 검색 ?q=검색어
       */
      { path: "/fundings/search", element: <FundingsSearch /> },
      /**
       * 펀딩 글
       */
      { path: "/fundings/:id", element: <FundingsDetail /> },
      /**
       * 펀딩 글 수정 및 삭제
       */
      { path: "/fundings/:id/edit", element: <FundingsEdit /> },
      /**
       * 펀딩 글 작성
       */ { path: "/fundings/post", element: <FundingsWrite /> },
      { path: "/google-login", element: <GoogleLogin></GoogleLogin> },
      { path: "*", element: <h1>Not Found</h1> },
      /**
       * 펀딩 후원 결제 페이지
       */ { path: "/fundings/:id/pay/", element: <FundingsPay /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={browserRouter}></RouterProvider>;
}

export default App;
