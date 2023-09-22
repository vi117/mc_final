import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import classes from "./SearchModal.module.css";
import SearchModalBasic from "./SearchModalBasic";

function AutoComplete() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 가상의 검색어 목록
  const searchSuggestions = [
    "강아지",
    "banana",
    "cherry",
    "date",
    "grape",
    "lemon",
    "lime",
    "orange",
    "peach",
  ];

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputValue(text);

    // 입력된 텍스트와 관련된 검색어 추천 목록 생성
    const filteredSuggestions = searchSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  // 모달창 노출 여부 state
  const [modalOpen, setModalOpen] = useState(false);

  // 모달창 노출
  const openModal = () => {
    setModalOpen(true);
  };

  const handleSearch = () => {
    // 검색 로직 구현
    console.log("검색어:", inputValue);
  };

  return (
    <div className={classes["search_bar_container"]}>
      <input
        className={classes["search_bar"]}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="검색어를 입력하세요."
        onClick={openModal} // 검색 창을 클릭하면 모달 열기
      />
      {showSuggestions && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <NavLink to={"/fundings/search"}>
        <FiSearch
          className={classes["search_bar_button"]}
          onClick={handleSearch}
        />
      </NavLink>
      {modalOpen && <SearchModalBasic setModalOpen={setModalOpen} />}
    </div>
  );
}

export default AutoComplete;
