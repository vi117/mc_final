import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import useSWR from "swr";
import classes from "../styles/community.module.css";
import Category from "./category";

const Board = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [categoryFiltered, setCategoryFiltered] = useState([]);
  const [applyModalFilter, setApplyModalFilter] = useState(false);
  const [originalData, setOriginalData] = useState([]);

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
  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useSWR(
    "/api/v1/articles",
    (url) => fetch(url).then((res) => res.json()),
  );

  const selectCheckbox = (animal) => {
    if (selectedAnimals.includes(animal)) {
      setSelectedAnimals(selectedAnimals.filter((a) => a !== animal));
      console.log(selectedAnimals);
    } else {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
  };

  const filterResult = () => {
    const filteredAnimals = animals.filter((animal) =>
      !selectedAnimals.includes(animal)
    );
    const dataTofilter = filteredAnimals.length === 0
      ? fetcherData
      : filteredData;
    if (filteredAnimals.length === 0) {
      setFilteredData(fetcherData);
    } else {
      const result = fetcherData.filter((currData) =>
        filteredAnimals.includes(currData.category)
      );
      setFilteredData(result);
    }
    setIsModalOpen(false);
    CategoryFiltered(null, dataTofilter);
    console.log(setFilteredData);
  };

  const handleTitleClick = (item) => {
    console.log("Modal 클릭됨:", item);
    setIsModalOpen(false);
  };

  const CategoryFiltered = (catItem, dataToFilter = fetcherData) => {
    if (catItem === null || catItem === undefined) {
      setCategoryFiltered(dataToFilter);
    } else {
      const CategoryFilteredItems = dataToFilter.filter(
        (currData) => currData.category === catItem,
      );
      setCategoryFiltered(CategoryFilteredItems);
    }
  };

  const resetFilter = () => {
    setIsModalOpen(false);
    setSelectedAnimals([]);
    setFilteredData(originalData);
    setCategoryFiltered(originalData);
    setApplyModalFilter(false);
    console.log(originalData);
  };
  useEffect(() => {
    if (fetcherData) {
      const newData = fetcherData.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      setFilteredData(newData);
      setOriginalData(newData);
    }
  }, [fetcherData]);

  if (fetcherIsLoading) {
    return <div>로딩중...</div>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <>
      <Modal show={isModalOpen}>
        <div className={classes["title"]}>
          <p>잠깐! 커뮤니티에 들어가시기 전에</p>
          <h1>필터링 키워드를 선택해주세요</h1>
        </div>
        <div className={classes["selecttable"]}>
          <Form>
            {animals.map((animal, index) => (
              <div key={`filter-${index}`}>
                <Form.Check
                  inline
                  id={`checkbox-${index}`}
                  className={classes["mb-3"]}
                  type="checkbox"
                  name={`check${index + 1}`}
                  label={animal}
                  checked={selectedAnimals.includes(animal)}
                  onChange={() => selectCheckbox(animal)}
                />
              </div>
            ))}
          </Form>
        </div>
        <div className={classes["filterbtnarea"]}>
          <button
            className={classes["closebtn"]}
            onClick={resetFilter}
            style={{ marginRight: "5px" }}
          >
            그냥 보기
          </button>
          <button
            className={classes["filteron"]}
            onClick={filterResult}
          >
            저장하기
          </button>
        </div>
      </Modal>

      <div className={classes["board"]}>
        <div className={classes["category"]}></div>
        <Category
          applyModalFilter={applyModalFilter}
          filterData={(catItem, dataToFilter) =>
            CategoryFiltered(catItem, dataToFilter)}
        />
        <table className={classes["board-table"]}>
          <thead>
            <tr>
              <th scope="col" className={classes["th-num"]}>
                번호
              </th>
              <th scope="col" className={classes["th-cat"]}>
                카테고리
              </th>
              <th scope="col" className={classes["th-title"]}>
                제목
              </th>
              <th scope="col" className={classes["th-author"]}>
                글쓴이
              </th>
              <th scope="col" className={classes["th-views"]}>
                조회수
              </th>
            </tr>
          </thead>
          <tbody>
            {categoryFiltered && categoryFiltered.map((item) => (
              <tr
                key={`board-${item.id}`}
                onClick={() => handleTitleClick(item)}
              >
                <td className={classes["td-num"]}>{item.id}</td>
                <td className={classes["td-cat"]}>{item.category}</td>
                <td className={classes["td-title"]}>{item.title}</td>
                <td>{item.author_nickname}</td>
                <td>{item.view_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Board;
