import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      {/* <hr style={{ maxWidth: "1080px", margin: "0px auto" }} /> */}
      <Footer />
    </div>
  );
}
