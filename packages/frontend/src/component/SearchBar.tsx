import { FiSearch } from "react-icons/fi";
import classes from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={classes["search_bar_container"]}>
      <input
        className={classes["search_bar"]}
        placeholder="검색어를 입력하세요."
      />
      <FiSearch className={classes["search_bar_button"]} />
    </div>
  );
}
