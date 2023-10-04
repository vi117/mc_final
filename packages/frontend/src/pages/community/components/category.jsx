import { Dropdown } from "react-bootstrap";
import { ANIMAL_CATEGORY } from "../constant";
import classes from "../styles/community.module.css";
import CustomMenu from "./Menu";
import CustomToggle from "./Toggle";

const animals = ANIMAL_CATEGORY;

const Category = (
  { selectCategoryFilter, selectOrderBy, setIsModalOpen },
) => {
  return (
    <>
      <div className={classes["control"]}>
        <button onClick={() => selectOrderBy("id")}>최신 순</button>
        <button onClick={() => selectOrderBy("like_count")}>좋아요 순</button>
        <button>
          <Dropdown>
            <div className={classes["togglemenu"]}>
              <Dropdown.Toggle
                as={CustomToggle}
              >
                카테고리
              </Dropdown.Toggle>
            </div>
            <Dropdown.Menu as={CustomMenu}>
              {animals.map((animal, index) => (
                <Dropdown.Item
                  key={`dropdown-${index}`}
                  eventKey={animal}
                  onClick={() => selectCategoryFilter(animal)}
                >
                  {animal}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </button>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          필터링 다시하기
        </button>
      </div>
    </>
  );
};

export default Category;
