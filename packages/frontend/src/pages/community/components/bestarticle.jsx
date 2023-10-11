import { Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/carousel.css";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const BestArticle = () => {
  return (
    <>
      <div className="bestitem-container">
        <div className="community-carousel-wrap">
          <h1>
            <AiOutlineThunderbolt className="thunder_svg">
            </AiOutlineThunderbolt>
            금주의 <b>베스트</b> 게시물
          </h1>
          <Carousel
            data-bs-theme="dark"
            indicators={false}
            prevIcon={
              <GoArrowLeft aria-hidden="true" className="best-prev-icon" />
            }
            nextIcon={
              <GoArrowRight aria-hidden="true" className="best-next-icon" />
            }
          >
            <Carousel.Item>
              <NavLink to={"/community/27"}>
                <div className="best-carousel-item">
                  <img src="https://bff-images.bemypet.kr/media/medias/all/280-KakaoTalk_Photo_2023-09-10-21-32-50.jpeg">
                  </img>
                  <div className="best-carousel-text-wrap">
                    <div className="best-carousel-text-title">
                      고양이 아이스크림 줘도 되나요?
                    </div>
                    <div className="best-carousel-text-author">
                      admin
                    </div>
                    <div className="best-carousel-text-desc">
                      아이스크림 먹을 때마다 졸래졸래 따라와서 킁킁 냄새맡고
                      핱으려고 하는 냥이 사람이 먹는 음식을 주면 안된다고
                      하는데, 너무 먹고 싶어해서요. 살짝만 핱아보라고 줘도
                      괜찮을까요?
                    </div>
                  </div>
                </div>
              </NavLink>
            </Carousel.Item>
            <Carousel.Item>
              <NavLink to={"/community/25"}>
                <div className="best-carousel-item">
                  <img src="https://bff-images.bemypet.kr/media/medias/all/163-image_picker_50636B55-8924-417E-96D8-82566C2E3A3A-99534-0000459CE1BB2F52.jpg">
                  </img>
                  <div className="best-carousel-text-wrap">
                    <div className="best-carousel-text-title">
                      궁디팡팡 해주면 좋아하다가 갑자기 콱 깨물어요
                    </div>
                    <div className="best-carousel-text-author">
                      admin
                    </div>
                    <div className="best-carousel-text-desc">
                      궁디팡팡 진짜 살살 해주다가

                      애옹 하면서 계속 해달라고 눕길래 쭉 궁디팡팡 해줬더니

                      갑자기 콱 세게 깨물어요 ㅜㅜ…
                    </div>
                  </div>
                </div>
              </NavLink>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default BestArticle;
