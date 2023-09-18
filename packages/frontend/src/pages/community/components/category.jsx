import { Dropdown } from "react-bootstrap";
import { BiSolidPencil } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import classes from "../styles/community.module.css";
import CustomMenu from "./Menu";
import CustomToggle from "./Toggle";

const Category = ({ filterData }) => {
  const handleFilter = (catItem) => {
    filterData(catItem);
    console.log(catItem);
  };

  const navigate = useNavigate();
  const goWrite = () => {
    navigate("/community/:id/post");
  };

  const animals = [
    "강아지",
    "고양이",
    "햄스터",
    "어류",
    "조류",
    "파충류",
    "양서류",
    "갑각류",
  ];

  return (
    <>
      <div className={classes["nav"]}>
        <div className={classes["control"]}>
          <button>최신 순</button>
          <button>좋아요 순</button>
          <Dropdown>
            <div className={classes["toggle"]}>
              <div className={classes["togglemenu"]}>
                <Dropdown.Toggle as={CustomToggle}>카테고리</Dropdown.Toggle>
              </div>
              <Dropdown.Menu as={CustomMenu}>
                {animals.map((animal, index) => (
                  <Dropdown.Item
                    key={`dropdown-${index}`}
                    eventKey={animal}
                    onClick={() => handleFilter(animal)}
                  >
                    {animal}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </div>
          </Dropdown>
        </div>
        <div className={classes["writebtn"]}>
          <p onClick={goWrite}>
            <BiSolidPencil
              style={{ width: "14px", fill: "#3d8361", marginRight: "5px" }}
            />
            글쓰기
          </p>
        </div>
      </div>
    </>
  );
};

export default Category;
