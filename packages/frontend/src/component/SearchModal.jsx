import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import classes from "./SearchModal.module.css";
import SearchModalBasic from "./SearchModalBasic";

// 검색 모달을 띄우는 페이지
function SearchModal() {
  // 모달창 노출 여부 state
  const [modalOpen, setModalOpen] = useState(false);

  // 모달창 노출
  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <div className={classes["search_bar_area"]}>
      <div className={classes["search_bar_container"]}>
        <input
          className={classes["search_bar"]}
          // type="text"
          placeholder="검색어를 입력하세요."
          onClick={openModal} // 검색 창을 클릭하면 모달 열기
        />
        <NavLink to={"/fundings"}>
          <FiSearch className={classes["search_bar_button"]} />
        </NavLink>
      </div>
      {modalOpen && <SearchModalBasic setModalOpen={setModalOpen} />}
    </div>
  );
}

export default SearchModal;
