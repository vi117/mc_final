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
      <div className="main-home-container">
        <div className="banner">
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={false}
          >
            <Carousel.Item>
              <img src="/sample.png" className="carousel_img"></img>
            </Carousel.Item>
            <Carousel.Item>
              <img src="/sample.png" className="carousel_img"></img>
            </Carousel.Item>
            <Carousel.Item>
              <img src="/sample.png" className="carousel_img"></img>
            </Carousel.Item>
          </Carousel>
        </div>

        <div className="funding-banner-container">
          <div className="home-funding-title">
            금주의<b style={{ fontWeight: "700" }}>&nbsp;베스트 펀딩</b>을
            확인해보세요!
          </div>
          <div className="home-funding-banner">
            <Carousel indicators={false} className="home-carousel2">
              <Carousel.Item>
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjIgGrfevQhicyAFH9OQJ0-rtlQi3Al6uzthfS9SBfJx1yzgH7YQSmOZ67k7uqnyBxbxPdLEBiACRiyXXghnuPK9M_633_P6F_3LNT98Xf9NxgzL6idMJmC0JJb2Fkyd3zWi-7raV8AMwHMT_3AKmT9sWdm6bIt231Qu-UdjGw869T_kn6BOZYU0IAGRq0b/s1178/funding1.jpg"
                  className="carousel_img"
                >
                </img>
              </Carousel.Item>
              <Carousel.Item>
                <img src={placeholder} className="carousel_img"></img>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="home-funding-title" style={{ marginTop: "30px" }}>
            <b style={{ fontWeight: "700" }}>신규 펀딩</b>을 확인해 보세요!
          </div>
          <div className="home-funding-banner">
            <Carousel indicators={false} className="home-carousel2">
              <Carousel.Item>
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDYY2BzEkLZHTGqetYKSuN2lhSLl0fYmmGt6Og0YZLtQQpv4XrDyHgZE-9NmvfCmNW0-CevCQXEm8iD3CbBAyTMxGdRS_s-24EIVaDNUU3IS-ixaGRgnb_YMa2iNwdf4OIn5Er3GqVQSxY-vYP1oXntv8yZ71OAIJlzw2oLcVABXfngSsLLyJNglocE1PQ/s1178/funding2.jpg"
                  className="carousel_img"
                >
                </img>
              </Carousel.Item>
              <Carousel.Item>
                <img src={placeholder} className="carousel_img"></img>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
