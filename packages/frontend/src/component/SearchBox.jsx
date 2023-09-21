import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FiSearch } from "react-icons/fi";
import classes from "./SearchBox.module.css";

function OffCanvasExample({ name, ...props }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {name === "end" && (
        <FiSearch
          className={classes["search_bar_button"]}
          onClick={handleShow}
        />
      )}
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>검색</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* 검색창 */}
          <input type="text" placeholder="검색어를 입력하세요" />

          {/* 추천 검색어 */}
          <div className={classes["recommendations"]}>
            <p>추천 검색어:</p>
            <ul>
              <li>검색어1</li>
              <li>검색어2</li>
              <li>검색어3</li>
            </ul>
          </div>

          {/* 연관 검색어 */}
          <div className={classes["related-terms"]}>
            <p>연관 검색어:</p>
            <ul>
              <li>연관어1</li>
              <li>연관어2</li>
              <li>연관어3</li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function Example() {
  return (
    <>
      {["start", "end", "top", "bottom"].map((placement, idx) => (
        <OffCanvasExample key={idx} placement={placement} name={placement} />
      ))}
    </>
  );
}

export default Example;
