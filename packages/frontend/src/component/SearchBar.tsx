import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="search_bar_container">
      <input className="search_bar" placeholder="검색어를 입력하세요." />
      <div className="search_button">
        icon
        {/* TODO(vi117): 추후 아이콘 추가 */}
      </div>
    </div>
  );
}
