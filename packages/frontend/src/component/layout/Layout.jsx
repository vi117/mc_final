import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

import "./Layout.css";

export function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <hr />
      <Footer />
    </div>
  );
}
