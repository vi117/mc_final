import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Sampledata from "../assets/sampledata";
import CustomMenu from "./menu";
import CustomToggle from "./toggle";
import "../styles/community.css";
import Pencil from "../assets/pencil.svg";
const Board = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Sampledata 배열을 초기 데이터로 설정
    setData(Sampledata);

    // Sampledata 배열을 매핑하여 각 항목에 번호를 추가
    const newData = Sampledata.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setFilteredData(newData);
  }, []);

  const filterResult = (catItem) => {
    // 선택한 카테고리에 따라 데이터 필터링
    const result = data.filter((currData) => currData.category === catItem);
    setFilteredData(result);
  };

  return (
    <>
      <div className="board">
        <div className="category"></div>
        <Category filterData={(catItem) => filterResult(catItem)} />
        <table className="board-table">
          <thead>
            <tr>
              <th scope="col" className="th-num">
                번호
              </th>
              <th scope="col" className="th-cat">
                카테고리
              </th>
              <th scope="col" className="th-title">
                제목
              </th>
              <th scope="col" className="th-author">
                글쓴이
              </th>
              <th scope="col" className="th-views">
                조회수
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td className="td-title">{item.title}</td>
                <td>{item.createdBy}</td>
                <td>{item.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Category = ({ filterData }) => {
  const handleFilter = (catItem) => {
    filterData(catItem);
  };

  const navigate = useNavigate();
  const goWrite = () => {
    navigate("/community/:id/edit");
  };
  return (
    <>
      <div className="nav">
        <div className="control">
          <button>최신 순</button>
          <button>좋아요 순</button>
          <Dropdown>
            <div className="toggle">
              <div className="togglemenu">
                <Dropdown.Toggle as={CustomToggle}>카테고리</Dropdown.Toggle>
              </div>
              <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => handleFilter("강아지")}
                >
                  강아지
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => handleFilter("고양이")}
                >
                  고양이
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => handleFilter("햄스터")}
                >
                  햄스터
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => handleFilter("어류")}
                >
                  어류
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => handleFilter("조류")}
                >
                  조류
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => handleFilter("파충류")}
                >
                  파충류
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => handleFilter("양서류")}
                >
                  양서류
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => handleFilter("갑각류")}
                >
                  갑각류
                </Dropdown.Item>
              </Dropdown.Menu>
            </div>
          </Dropdown>
        </div>
        <div className="writebtn">
          <p onClick={goWrite}>
            <img src={Pencil} style={{ width: "14px" }} />
            글쓰기
          </p>
        </div>
      </div>
    </>
  );
};

export default Board;
