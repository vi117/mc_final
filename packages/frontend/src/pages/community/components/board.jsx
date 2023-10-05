import { useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { BiSolidPencil } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../component/Button";
import useArticles from "../../../hook/useArticles";
import { ANIMAL_CATEGORY } from "../constant";
import classes from "../styles/community.module.css";
import Category from "./category";
import Page from "./Pagination";

const animals = ANIMAL_CATEGORY;

function getRestAnimals(filterAnimals) {
  return animals.filter((animal) => !filterAnimals.includes(animal));
}

// TODO(vi117): refactor this. make hook for session storage.
function saveCategoryRepo(categories) {
  sessionStorage.setItem("article_category_filter", JSON.stringify(categories));
}
function loadCategoryFilter() {
  const categories = sessionStorage.getItem("article_category_filter");
  if (categories) {
    return JSON.parse(categories);
  }
  return null;
}

const Board = () => {
  const [isModalOpen, setIsModalOpen] = useState(loadCategoryFilter() === null);
  const [categoryFiltered, setCategoryFiltered] = useState(
    loadCategoryFilter() ?? [],
  );
  const [orderBy, setOrderBy] = useState("id");
  const itemsPerPage = 10;
  const [activePage, setActivePage] = useState(1);
  const itemsRange = 7;
  const offset = (activePage - 1) * itemsPerPage;
  const endPageoffset = offset + itemsPerPage * Math.floor(itemsRange / 2);
  const limit = endPageoffset - offset;

  const navigate = useNavigate();
  const goWrite = () => {
    navigate("/community/:id/post");
  };

  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useArticles({
    offset: offset,
    limit: limit,
    categories: getRestAnimals(categoryFiltered),
    orderBy,
  });

  if (fetcherIsLoading) {
    // TODO(vi117): use bootstrap placeholder instead of spinner
    return <Spinner></Spinner>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }
  console.log(Math.floor(fetcherData.length / itemsPerPage), activePage);
  return (
    <>
      <FilterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        categoryFiltered={categoryFiltered}
        onApplyFilter={(v) => {
          setCategoryFiltered(v);
          saveCategoryRepo(v);
          setIsModalOpen(false);
        }}
      />

      <Category
        selectCategoryFilter={(c) => {
          setCategoryFiltered([c]);
        }}
        selectOrderBy={(o) => {
          setOrderBy(o);
        }}
        setIsModalOpen={setIsModalOpen}
      />
      <div className={classes["board"]}>
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
            {fetcherData.slice(0, itemsPerPage).map((item) => (
              <tr
                key={`board-${item.id}`}
              >
                <td className={classes["td-num"]}>{item.id}</td>
                <td className={classes["td-cat"]}>{item.category}</td>
                <td className={classes["td-title"]}>
                  <Link to={`/community/${item.id}`}>
                    {item.title}
                  </Link>
                </td>
                <td>
                  <Link to={`/host-profile/${item.author_id}`}>
                    {item.author_nickname}
                  </Link>
                </td>
                <td className={classes["td-views"]}>{item.view_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={classes["writebtn"]}>
        <button className={classes["writebtn-button"]} onClick={goWrite}>
          <BiSolidPencil
            className={classes["pencil-svg"]}
          />
          글쓰기
        </button>
      </div>
      <div className={classes["pagination"]}>
        <Page
          range={itemsRange}
          activePage={activePage}
          endPage={Math.floor(fetcherData.length / itemsPerPage) + activePage}
          handlePageChange={(pageNumber) => {
            setActivePage(pageNumber);
          }}
        >
        </Page>
      </div>
    </>
  );
};

export default Board;

function FilterModal(
  {
    isModalOpen,
    onApplyFilter,
    categoryFiltered,
  },
) {
  const [selectedAnimals, setSelectedAnimals] = useState(
    categoryFiltered ?? [],
  );

  return (
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
                onChange={() => {
                  if (selectedAnimals.includes(animal)) {
                    setSelectedAnimals(
                      selectedAnimals.filter((a) => a !== animal),
                    );
                  } else {
                    setSelectedAnimals([...selectedAnimals, animal]);
                  }
                }}
              />
            </div>
          ))}
        </Form>
      </div>
      <div className={classes["filterbtnarea"]}>
        <Button
          className={classes["closebtn"]}
          onClick={() => {
            onApplyFilter([]);
          }}
          style={{ marginRight: "5px" }}
        >
          그냥 보기
        </Button>
        <Button
          className={classes["filteron"]}
          onClick={() => {
            onApplyFilter(selectedAnimals);
          }}
        >
          저장하기
        </Button>
      </div>
    </Modal>
  );
}
