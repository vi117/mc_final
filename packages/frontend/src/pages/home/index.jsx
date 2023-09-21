import { useState } from "react";
import { Carousel } from "react-bootstrap";
import "./home.css";

export function HomePage() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

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
              <Carousel.Caption>
                <h3>시선집중 스페셜 기획전</h3>
                <p>해피테일즈 단독 펀딩을 살펴보세요</p>
              </Carousel.Caption>
              <div className="img-overlay" />
              <img src="/sample.png" className="carousel_img"></img>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption>
                <h3>만나서 반가워요!</h3>
                <p>즉시 할인 신규 가입 혜택 알아보기</p>
              </Carousel.Caption>
              <div className="img-overlay" />
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR5fRTjU1l0RaTtMemRHeUcJsoamu3P9NDYQ1pfol5UnLm0el77VzVGk-z1j73uvegJr3f9mySNDSG2kB-gvy6Fa-oArqx-jc68I8lKzSzetKSayZAk8HM1Z0zebs4T2d8mBwaru_VfswQURZO8Qv-fiZbCEEYw-iXajUbw-Tm5Tvv1RX11QGVW3slfZjx/s1920/banner1.jpg"
                className="carousel_img"
              >
              </img>
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
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiaCXnYJqJV0CWbJumvp_dlYSf6p9D0uzCGho7vbgVeOk26dksQuyOxdhtM-hEXHRJiugXNKBStP2x4ykZ11cSU5raxTtfYIOXsEZJ1kPKDO60lNy6MiF7-gb9LwJGRL8Ujg2JVOskPbjpTLJHN2h3i5GTHlSthkSuFNQDuV2QPm_PVOCnGbl3PXLVEnJeJ/s1178/funding4.jpg"
                  className="carousel_img"
                >
                </img>
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
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSObSVrzZy97-7DzmzA1db8c4vhSMZvrdioiDLRMC8BFv7Bh6diebLP1mdP41IBDKjspey2INOTnQ9Q5Rt6iZQBbKYvCbWC3yCldufr780bHzNa0HVnLR8I41_g45bkF-wXMqafSv85tLGR16kppPP02kOsd3dpkL9QYUZcHVPTjpidKB1hiBY07dGbUCW/s1178/funding3.jpg"
                  className="carousel_img"
                >
                </img>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
