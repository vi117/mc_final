import { useState } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./home.module.css";

export function HomePage() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <div className={classes["main-home-container"]}>
        <div className={classes["banner"]}>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={false}
          >
            <Carousel.Item>
              <Carousel.Caption className={classes["carousel-caption"]}>
                <h3>시선집중 스페셜 기획전</h3>
                <p>해피테일즈 단독 펀딩을 살펴보세요</p>
              </Carousel.Caption>
              <div className={classes["img-overlay"]} />
              <img src="/sample.png" className={classes["carousel_img"]}></img>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption className={classes["carousel-caption"]}>
                <h3>만나서 반가워요!</h3>
                <p>즉시 할인 신규 가입 혜택 알아보기</p>
              </Carousel.Caption>
              <div className={classes["img-overlay"]} />
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR5fRTjU1l0RaTtMemRHeUcJsoamu3P9NDYQ1pfol5UnLm0el77VzVGk-z1j73uvegJr3f9mySNDSG2kB-gvy6Fa-oArqx-jc68I8lKzSzetKSayZAk8HM1Z0zebs4T2d8mBwaru_VfswQURZO8Qv-fiZbCEEYw-iXajUbw-Tm5Tvv1RX11QGVW3slfZjx/s1920/banner1.jpg"
                className={classes["carousel_img"]}
              >
              </img>
            </Carousel.Item>
          </Carousel>
        </div>

        <div className={classes["funding-banner-container"]}>
          <div className={classes["home-funding-title"]}>
            금주의<b style={{ fontWeight: "700" }}>&nbsp;베스트 펀딩</b>을
            확인해보세요!
          </div>
          <div className={classes["home-funding-banner"]}>
            <Carousel indicators={false} className={classes["home-carousel2"]}>
              <Carousel.Item>
                <Link to={"/fundings/"}>
                  <Carousel.Caption
                    className={classes["carousel-item-caption"]}
                  >
                    <p>지구를 지키는 댕댕이</p>
                    <h3>
                      <b>비건 한지가죽 하네스</b>
                    </h3>
                    <span className={classes["carousel-item-caption-tags"]}>
                      #산책용품 #유기견후원
                    </span>
                  </Carousel.Caption>
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRZROZcwGUl0NbZmJeifWuLN0MI3EPMJD2YyGm5zdLo9wedlt6Njzgd76T4gMq9imONJNKO356iPeDWnSTcp7hDPYbzv6sOXyVnQdM4ggNPw8uH8A82bdAfBjaj7PjwcSlMB98bf-g5vsdRl6ziwDQFs72PKdFJacthpG9YLmWdGmxmqBQ8l_A9M3fhuvM/s1178/banner4.jpg"
                    className={classes["carousel_img"]}
                  >
                  </img>
                </Link>
              </Carousel.Item>
              <Carousel.Item>
                <Link to={"/fundings/2"}>
                  <Carousel.Caption
                    className={classes["carousel-item-caption"]}
                  >
                    <p>크리스마스, 함께 즐겨요</p>
                    <h3>
                      육지거북 <b>꼬마 모자</b>
                    </h3>
                    <span className={classes["carousel-item-caption-tags"]}>
                      #패션소품
                    </span>
                  </Carousel.Caption>
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkMhWkfOIhGjTT_wtDjGSL9KXdEFjCXKAtxMKb4GSOgi4FhkOfvrSaH-U2rnhsdxPJpDQITyzvMNYApiF3cGqy1grck3N84TJa-TpcUAxfjKgDh5QUYj7M-ggEKr0K3moNAMAshpbCSdh9AEUKrGhLwczXxCjqiB7-FC9Qyhe2m-5PlNk_s_Tgs9OQ2SF5/s1178/banner1.jpg"
                    className={classes["carousel_img"]}
                  >
                  </img>
                </Link>
              </Carousel.Item>
            </Carousel>
          </div>
          <div
            className={classes["home-funding-title"]}
            style={{ marginTop: "30px" }}
          >
            <b style={{ fontWeight: "700" }}>신규 펀딩</b>을 확인해 보세요!
          </div>
          <div className={classes["home-funding-banner"]}>
            <Carousel indicators={false} className={classes["home-carousel2"]}>
              <Carousel.Item>
                <Link to={"/fundings/1"}>
                  <Carousel.Caption
                    className={classes["carousel-item-caption"]}
                  >
                    <p>아이들을 생각한</p>
                    <h3>
                      궁극의 <b>고양이 유산균</b>
                    </h3>
                    <span className={classes["carousel-item-caption-tags"]}>
                      #건강식품 #유기묘후원
                    </span>
                  </Carousel.Caption>
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUO63r5KdeMjbn-6j_JaNULRZWjb9p8b6PLnYmHhBDGCcNUdsjdePCcWdZho6VVqRkzKFJm6jrcHDctrrXTHaXF0cetPjoXQ49bGOP44mHoJDLzb2qnH9tJ_UUT0zpAvUY77_SN9K5RiH-5C9SNUgUivAIj4mtjCxPKgwFuMmV4rszuEPUzN_KxAJ85lq3/s1178/banner3.jpg"
                    className={classes["carousel_img"]}
                  >
                  </img>
                </Link>
              </Carousel.Item>
              <Carousel.Item>
                <Link to={"/fundings/3"}>
                  <Carousel.Caption
                    className={classes["carousel-item-caption"]}
                  >
                    <p>소형조 전용!</p>
                    <h3>
                      면역력 향상 <b>영양 모이</b>
                    </h3>
                    <span className={classes["carousel-item-caption-tags"]}>
                      #건강식품
                    </span>
                  </Carousel.Caption>
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjo9562GJx8IrkwUhOUs-jgj3koB8lHQOX-ulPxdd5UAj6bxKi0ceq48E1Nb3CcfXSUbFo12GXFIvaeZ-rJcDGx0GFyqEvRrbhl4srlVb1EpUGIsuxBKLYpSNZFaz090xxjlkV1eNBv6efmB9sCtyC8xApMBdjsVP7U0XK-AymnAQ_dIkQuQZntnoDPpRJq/s1178/banner2.jpg"
                    className={classes["carousel_img"]}
                  >
                  </img>
                </Link>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
