import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import CustomMenu from "./toggle/menu";
import CustomToggle from "./toggle/toggle";
import "./commu.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sampledata from "./assets/sampledata";
import Page from "./pagination";

export function Community() {
  const [state, setState] = useState({
    data: sampledata,
    limit: 10,
    activePage: 1,
  });

  const handlePageChange = (pageNumber) => {
    setState((prev) => ({ ...prev, activePage: pageNumber }));
  };

  const navigate = useNavigate();
  const goWrite = () => {
    navigate("/community/:id/edit");
  };

  return (
    <>
      <div className="App">
      </div>
      <div class="list-wrap">
        <p style={{ fontSize: "24px", marginBottom: "0px" }}>금주의 베스트</p>
        <Carousel>
          <Carousel.Item>
            <div className="slidercontents" style={{ marginTop: "0px" }}>
              <img src="/thumb.png"></img>
              <div className="wrapText">
                <h1>베스트 글 제목1</h1>
                <div className="d-none d-md-block">
                  <p>
                    아이스크림 먹을 때마다 졸래졸래 따라와서 킁킁 냄새맡고 핱으려고 하는 냥이 사람이 먹는 음식을 주면
                    안된다고 하는데, 너무 먹고 싶어해서요. 살짝만 핱아보라고 줘도 괜찮을까요?
                  </p>
                </div>
                <button onClick="location.href='./'">자세히보기</button>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="slidercontents2">
              <img src="/thumb2.png"></img>
              <div className="wrapText">
                <h1>베스트 글 제목 2</h1>
                <div className="d-none d-md-block">
                  <p>
                    세이오앙 모래는 항상 우주네 곳간에 쟁여 놓는 벤토예요. 먼지날림, 탈취력, 응고력의 밸런스가 골고루
                    좋고 입자가 보들보들해서인지 우주의 선호도도 높더라고요😆
                  </p>
                </div>
                <button onClick="location.href='./'">자세히보기</button>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        <div class="container">
          <div class="board">
            <table className="board-table">
              <thead>
                <tr>
                  <th scope="col" class="th-num">번호</th>
                  <th scope="col" class="th-cat">카테고리</th>
                  <th scope="col" class="th-title">제목</th>
                  <th scope="col" class="th-author">글쓴이</th>
                  <th scope="col" class="th-views">조회수</th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.category}</td>
                    <td class="td-title">{item.title}</td>
                    <td>{item.createdBy}</td>
                    <td>{item.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div class="control">
            <div class="recent-btn" style={{ marginRight: "10px" }}>
              최신 순
            </div>
            <div class="popular-btn">
              좋아요 순
            </div>
            <div class="write">
              <button onClick={goWrite}>
                글 작성
              </button>
            </div>
            <Dropdown>
              <div class="cat-menu">
                <Dropdown.Toggle as={CustomToggle} class="togglemenu">
                  카테고리
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}>
                  <Dropdown.Item eventKey="1">강아지</Dropdown.Item>
                  <Dropdown.Item eventKey="2">고양이</Dropdown.Item>
                  <Dropdown.Item eventKey="2">햄스터</Dropdown.Item>
                  <Dropdown.Item eventKey="2">어류</Dropdown.Item>
                  <Dropdown.Item eventKey="2">조류</Dropdown.Item>
                  <Dropdown.Item eventKey="2">파충류</Dropdown.Item>
                  <Dropdown.Item eventKey="2">양서류</Dropdown.Item>
                  <Dropdown.Item eventKey="2">갑각류</Dropdown.Item>
                  <Dropdown.Item eventKey="2">기타</Dropdown.Item>
                </Dropdown.Menu>
              </div>
            </Dropdown>
          </div>
        </div>

        <div class="pagination">
          <Page
            totalItems={state.data.length} // 총 항목 수
            itemsPerPage={state.limit} // 페이지당 항목 수
            activePage={state.activePage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default Community;
