import { Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Board from "./components/board";
import classes from "./styles/Community.module.css";

export function Community() {
  return (
    <>
      <div className={classes["list-wrap"]}>
        <h1 style={{ fontSize: "24px", fontWeight: "700" }}>
          금주의 베스트
        </h1>
        <Carousel>
          <Carousel.Item>
            <div
              className={classes["slidercontents"]}
              style={{ marginTop: "0px" }}
            >
              <img src="https://bff-images.bemypet.kr/media/medias/all/280-KakaoTalk_Photo_2023-09-10-21-32-50.jpeg">
              </img>
              <div className={classes["wrapText"]}>
                <h1>고양이 아이스크림 줘도 되나요?</h1>
                <div className={classes["d-none-d-md-block"]}>
                  <p>
                    아이스크림 먹을 때마다 졸래졸래 따라와서 킁킁 냄새맡고
                    핱으려고 하는 냥이 사람이 먹는 음식을 주면 안된다고 하는데,
                    너무 먹고 싶어해서요. 살짝만 핱아보라고 줘도 괜찮을까요?
                  </p>
                </div>
                <NavLink to={"/community/27"}>
                  <button className={classes["morebtn"]}>자세히보기</button>
                </NavLink>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className={classes["slidercontents2"]}>
              <img src="https://bff-images.bemypet.kr/media/medias/all/163-image_picker_50636B55-8924-417E-96D8-82566C2E3A3A-99534-0000459CE1BB2F52.jpg">
              </img>
              <div className={classes["wrapText"]}>
                <h1>궁디팡팡 해주면 좋아하다가 갑자기 콱 깨물어요</h1>
                <div className={classes["d-none-d-md-block"]}>
                  <p>
                    궁디팡팡 진짜 살살 해주다가

                    애옹 하면서 계속 해달라고 눕길래 쭉 궁디팡팡 해줬더니

                    갑자기 콱 세게 깨물어요 ㅜㅜ…
                  </p>
                </div>
                <NavLink to={"/community/25"}>
                  <button className={classes["morebtn"]}>자세히보기</button>
                </NavLink>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        <div className={classes["container"]}>
          <Board></Board>
        </div>
      </div>
    </>
  );
}

export default Community;
