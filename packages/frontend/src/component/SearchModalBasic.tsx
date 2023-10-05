import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./SearchModalBasic.module.css";

function SearchModalBasic({ setModalOpen }: PropsType) {
  // 모달 끄기
  const closeModal = () => {
    setModalOpen(false);
  };

  // 모달 외부 클릭시 끄기 처리
  // Modal 창을 useRef로 취득
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 이벤트 핸들러 함수
    const handler = () => { // event 매개변수를 추가
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    // 이벤트 핸들러 등록
    document.addEventListener("mousedown", handler);

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener("mousedown", handler);
    };
  });

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const performSearch = () => {
    if (searchTerm) {
      navigate(`/fundings?title=${searchTerm}`);
      setModalOpen(false); // 모달 창 닫기
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  return (
    <div className={styles.body}>
      <div ref={modalRef} className={styles.container}>
        <button className={styles.close} onClick={closeModal}>
          <IoMdClose />
        </button>

        <div className={styles.search_bar_container}>
          <input
            autoFocus
            className={styles.search_bar}
            placeholder="검색어를 입력하세요."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.search_bar_button} onClick={performSearch}>
            <FiSearch className={styles.search_bar_button_detail} />
          </button>
        </div>
        <hr />
        <div className={styles.recommendtxt}>
          <p>추천 검색어</p>
          <ul className={styles.recommendlist}>
            <li>
              <NavLink to="fundings?title=강아지" onClick={closeModal}>
                강아지
              </NavLink>
            </li>
            <li>
              <NavLink to="fundings?title=고양이" onClick={closeModal}>
                고양이
              </NavLink>
            </li>
            <li>
              <NavLink to="fundings?title=소형조" onClick={closeModal}>
                소형조
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.recommendtxt}>
          <p>추천 태그</p>
          <ul className={styles.recommendlist}>
            <li>
              <NavLink to="fundings?tag=PS 인증" onClick={closeModal}>
                PS 인증
              </NavLink>
            </li>
            <li>
              <NavLink to="fundings?tag=앵무새" onClick={closeModal}>
                앵무새
              </NavLink>
            </li>
            <li>연관어3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default SearchModalBasic;
