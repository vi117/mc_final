import Dropdown from "react-bootstrap/Dropdown";
import CustomMenu from "./menu";
import CustomToggle from "./toggle";

const Category = ({ filterData }) => {
  const handleFilter = (catItem) => {
    // 선택한 카테고리를 filterData 함수를 통해 전달
    filterData(catItem);
  };

  return (
    <Dropdown>
      <div className="cat-menu">
        <Dropdown.Toggle as={CustomToggle} className="togglemenu">
          카테고리
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu}>
          <Dropdown.Item eventKey="1" onClick={() => handleFilter("강아지")}>
            강아지
          </Dropdown.Item>
          <Dropdown.Item eventKey="2" onClick={() => handleFilter("고양이")}>
            고양이
          </Dropdown.Item>
          <Dropdown.Item eventKey="3" onClick={() => handleFilter("햄스터")}>
            햄스터
          </Dropdown.Item>
        </Dropdown.Menu>
      </div>
    </Dropdown>
  );
};

export default Category;
