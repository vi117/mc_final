import { Carousel } from "react-bootstrap";

export function HomePage() {
  return (
    <>
      <h1>Logo</h1>
      금주의 베스트 펀딩을 확인해보세요!
      <Carousel>
        <Carousel.Item>
          <img src="/vite.svg"></img>
          <Carousel.Caption>
            <h3>강아지 구조 펀딩</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="/vite.svg"></img>
          <Carousel.Caption>
            <h3>새로운 파충류 온도 조절 장치 펀딩</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="/vite.svg"></img>
          <Carousel.Caption>
            <h3>아무거나</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      신규 펀딩을 확인해 보세요!
      <Carousel>
        <Carousel.Item>
          <img src="/vite.svg"></img>
          <Carousel.Caption>
            <h3>강아지 구조 펀딩</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="/vite.svg"></img>
          <Carousel.Caption>
            <h3>새로운 파충류 온도 조절 장치 펀딩</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="/vite.svg"></img>
          <Carousel.Caption>
            <h3>아무거나</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default HomePage;
