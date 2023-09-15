import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import "./styles/community.css";
import { useState } from "react";
import Sampledata from "./assets/sampledata";
import Board from "./components/board";
import Page from "./components/pagination";

export function Community() {
  const [state, setState] = useState({
    data: Sampledata,
    limit: 10,
    activePage: 1,
  });

  const handlePageChange = (pageNumber) => {
    setState((prev) => ({ ...prev, activePage: pageNumber }));
  };

  const { data, limit, activePage } = state;
  const startIndex = (activePage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPageData = data.slice(startIndex, endIndex);

  return (
    <>
      <div className="list-wrap">
        <h1 style={{ fontSize: "24px", marginBottom: "-20px" }}>
          금주의 베스트
        </h1>
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
                <button className="morebtn">자세히보기</button>
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
                <button className="morebtn">자세히보기</button>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        <div className="container">
          <Board data={currentPageData}></Board>
        </div>

        <div className="pagination">
          <Page
            totalItems={data.length}
            itemsPerPage={limit}
            activePage={activePage}
            handlePageChange={handlePageChange}
          >
            console.log(totalItems)
          </Page>
        </div>
      </div>
    </>
  );
}

export default Community;