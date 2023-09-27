import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import classes from "./Layout.module.css";

export function Layout() {
  return (
    <div className={classes.layout}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
