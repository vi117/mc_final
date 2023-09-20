import { useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { ANIMAL_CATEGORY } from "../constant";
import classes from "../styles/community.module.css";
import Category from "./category";

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

function useArticles({
  offset = 0,
  limit = 50,
  categories,
  tags,
  orderBy,
  /**
   * if true, include deleted articles. admin only.
   * @param {boolean}
   */
  include_deleted,
}) {
  const url = new URL("/api/v1/articles", window.location.href);
  url.searchParams.append("offset", offset);
  url.searchParams.append("limit", limit);

  if (categories && categories.length < animals.length) {
    categories.forEach((category) => {
      url.searchParams.append("categories[]", category);
    });
  }
  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      url.searchParams.append("tags[]", tag);
    });
  }

  if (["id", "like_count"].includes(orderBy)) {
    url.searchParams.append("orderBy", orderBy);
  } else {
    console.error("orderBy value isn't acceptable. value: ", orderBy);
    url.searchParams.append("orderBy", "id");
  }

  if (include_deleted) {
    url.searchParams.append("include_deleted", "true");
  }

  return useSWR(
    url.href,
    (url) => fetch(url).then((res) => res.json()),
  );
}

const Board = () => {
  const [isModalOpen, setIsModalOpen] = useState(loadCategoryFilter() === null);
  const [categoryFiltered, setCategoryFiltered] = useState(
    getRestAnimals(loadCategoryFilter() ?? []),
  );
  const [orderBy, setOrderBy] = useState("id");

  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useArticles({
    offset: 0,
    limit: 50,
    categories: categoryFiltered,
    orderBy,
  });

  if (fetcherIsLoading) {
    // TODO(vi117): use bootstrap placeholder instead of spinner
    return <Spinner></Spinner>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <>
      <FilterModal
        isModalOpen={isModalOpen}
        onApplyFilter={(v) => {
          setCategoryFiltered(v);
          saveCategoryRepo(v);
          setIsModalOpen(false);
        }}
      />

      <div className={classes["board"]}>
        <div className={classes["category"]}></div>
        <Category
          selectCategoryFilter={(c) => {
            setCategoryFiltered([c]);
          }}
          selectOrderBy={(o) => {
            setOrderBy(o);
          }}
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
            {fetcherData.map((item) => (
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

function FilterModal(
  {
    isModalOpen,
    onApplyFilter,
  },
) {
  const [selectedAnimals, setSelectedAnimals] = useState([]);

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
        <button
          className={classes["closebtn"]}
          onClick={() => {
            onApplyFilter([]);
          }}
          style={{ marginRight: "5px" }}
        >
          그냥 보기
        </button>
        <button
          className={classes["filteron"]}
          onClick={() => {
            onApplyFilter(selectedAnimals);
          }}
        >
          저장하기
        </button>
      </div>
    </Modal>
  );
}
