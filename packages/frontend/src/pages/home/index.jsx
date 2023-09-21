import { useState } from "react";
import { Carousel } from "react-bootstrap";
import "./home.css";

export function HomePage() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const placeholder = "https://via.placeholder.com/1200x375";

  return (
    <>
      <div className="banner">
        <Carousel activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <img src="/sample.png" className="carousel_img"></img>
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="/sample.png" className="carousel_img"></img>
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="/sample.png" className="carousel_img"></img>
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      <div
        style={{
          margin: "auto",
        }}
      >
        금주의 베스트 펀딩을 확인해보세요!
        <Carousel style={{}}>
          <Carousel.Item>
            <img src={placeholder} className="carousel_img"></img>
            <Carousel.Caption>
              <h3>강아지 구조 펀딩</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={placeholder} className="carousel_img"></img>
            <Carousel.Caption>
              <h3>새로운 파충류 온도 조절 장치 펀딩</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={placeholder} className="carousel_img"></img>
            <Carousel.Caption>
              <h3>아무거나</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        신규 펀딩을 확인해 보세요!

        <Carousel style={{}}>
          <Carousel.Item>
            <img src={placeholder} className="carousel_img"></img>
            <Carousel.Caption>
              <h3>강아지 구조 펀딩</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={placeholder} className="carousel_img"></img>
            <Carousel.Caption>
              <h3>새로운 파충류 온도 조절 장치 펀딩</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={placeholder} className="carousel_img"></img>
            <Carousel.Caption>
              <h3>아무거나</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
}

export default HomePage;
