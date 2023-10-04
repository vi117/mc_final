import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import classes from "./SearchModal.module.css";
import SearchModalBasic from "./SearchModalBasic";

function SearchModal() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <div className={classes["search_bar_area"]}>
      <div className={classes["search_bar_container"]}>
        <input
          className={classes["search_bar"]}
          placeholder="검색어를 입력하세요."
          onClick={openModal}
        />

        <FiSearch
          className={classes["search_bar_button"]}
          onClick={openModal}
        />
      </div>
      {modalOpen && <SearchModalBasic setModalOpen={setModalOpen} />}
    </div>
  );
}

export default SearchModal;
