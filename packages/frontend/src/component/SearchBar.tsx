import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import classes from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={classes["search_bar_container"]}>
      <input
        className={classes["search_bar"]}
        placeholder="검색어를 입력하세요."
      />
      <NavLink to={"/fundings/search"}>
        <FiSearch className={classes["search_bar_button"]} />
      </NavLink>
    </div>
  );
}
