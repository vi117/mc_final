import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
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

  return (
    <div className={styles.body}>
      <div ref={modalRef} className={styles.container}>
        <button className={styles.close} onClick={closeModal}>
          <IoMdClose />
        </button>
        <div className={styles.recommendtxt}>
          <p>추천 검색어</p>
          <ul className={styles.recommendlist}>
            <li>검색어1</li>
            <li>검색어2</li>
            <li>검색어3</li>
          </ul>
        </div>

        <div className={styles.recommendtxt}>
          <p>연관 검색어</p>
          <ul className={styles.recommendlist}>
            <li>연관어1</li>
            <li>연관어2</li>
            <li>연관어3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default SearchModalBasic;
