import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import classes from "./SearchModal.module.css";
import SearchModalBasic from "./SearchModalBasic";

function SearchModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const openModal = () => {
    setModalOpen(true);
  };

  const performSearch = () => {
    if (searchTerm) {
      navigate(`/fundings?title=${searchTerm}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  return (
    <div className={classes["search_bar_area"]}>
      <div className={classes["search_bar_container"]}>
        <input
          className={classes["search_bar"]}
          placeholder="검색어를 입력하세요."
          onClick={openModal}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />

        <NavLink to="#" onClick={performSearch}>
          <FiSearch className={classes["search_bar_button"]} />
        </NavLink>
      </div>
      {modalOpen && <SearchModalBasic setModalOpen={setModalOpen} />}
    </div>
  );
}

export default SearchModal;
