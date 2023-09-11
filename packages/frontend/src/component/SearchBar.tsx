import "./SearchBar.css";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <div className="search_bar_container">
      <input className="search_bar" placeholder="검색어를 입력하세요." />
      <FiSearch className="search_bar_button" />
    </div>
  );
}
