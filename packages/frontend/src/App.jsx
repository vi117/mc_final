import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./component/layout/Layout";
import HomePage from "./pages/home";

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
      { path: "/login", element: <h1>Login</h1> },
      /**
       * 회원가입 페이지
       */
      { path: "/register", element: <h1>Register</h1> },
      /**
       * 비밀번호 찾기
       */
      { path: "/forgot-password", element: <h1>Forgot Password</h1> },
      /**
       * 비밀번호 재설정
       */
      { path: "/reset-password", element: <h1>Reset Password</h1> },
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
      { path: "/community", element: <h1>Community</h1> },
      /**
       * 커뮤니티 글
       */
      { path: "/community/:id", element: <h1>Community</h1> },
      /**
       * 커뮤니티 글 수정 및 삭제
       */
      { path: "/community/:id/edit", element: <h1>Edit Community</h1> },
      /**
       * 커뮤니티 글 작성
       */
      { path: "/community/:id/post", element: <h1>Post</h1> },
      /**
       * 펀딩 홈
       */
      { path: "/fundings", element: <h1>Fundings</h1> },
      /**
       * 펀딩 검색 ?q=검색어
       */
      { path: "/fundings/search", element: <h1>Search</h1> },
      /**
       * 펀딩 글
       */
      { path: "/fundings/:id", element: <h1>Fundings</h1> },
      /**
       * 펀딩 글 수정 및 삭제
       */
      { path: "/fundings/:id/edit", element: <h1>Edit Fundings</h1> },
      /**
       * 펀딩 글 작성
       */
      { path: "/fundings/:id/post", element: <h1>Post</h1> },
      { path: "*", element: <h1>Not Found</h1> },
    ],
  },
]);

import "./App.css";

function App() {
  return <RouterProvider router={browserRouter}></RouterProvider>;
}

export default App;
