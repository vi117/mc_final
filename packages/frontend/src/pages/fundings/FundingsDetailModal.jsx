import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  BiLogoFacebookCircle,
  BiLogoTwitter,
  BiSolidMessageRounded,
} from "react-icons/bi";
import { GoLink, GoX } from "react-icons/go";
import { useLocation } from "react-router-dom";
import classes from "./FundingsDetail.module.css";

const FundingDetailModal = ({ show, handleClose }) => {
  const location = useLocation();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Kakao SDK 스크립트가 로드된 후에 실행할 코드
      // 이곳에서 Kakao.init()을 호출하고 카카오 SDK를 초기화할 수 있습니다.
      // Kakao.init("c9d8ac937059236e6e3f7a56267a28e4");  **kakao 정의가 안되고 있음
    };

    // 컴포넌트가 언마운트될 때 스크립트를 제거하는 것이 좋습니다.
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었어요.");
    } catch (err) {
      console.log(err);
    }
  };

  function shareFacebook() {
    var sendUrl = "http://localhost:5173/fundings/3"; // 전달할 URL
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendUrl);
  }

  function shareTwitter() {
    var sendText = "관심있는 펀딩을 공유합니다"; // 전달할 텍스트
    var sendUrl = "http://localhost:5173/fundings/5/"; // 전달할 URL
    window.open(
      "https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl,
    );
  }

  // function shareKakao() {

  //   // 사용할 앱의 JavaScript 키 설정
  //   // Kakao.init("c9d8ac937059236e6e3f7a56267a28e4");

  //   // 카카오링크 버튼 생성
  // //   Kakao.Link.createDefaultButton({
  // //     container: '#btnKakao', // 카카오공유버튼ID
  // //     objectType: 'feed',
  // //     content: {
  // //       title: "개발새발", // 보여질 제목
  // //       description: "개발새발 블로그입니다", // 보여질 설명
  // //       imageUrl: "devpad.tistory.com/", // 콘텐츠 URL
  // //       link: {
  // //          mobileWebUrl: "devpad.tistory.com/",
  // //          webUrl: "devpad.tistory.com/"
  // //       }
  // //     }
  // //   });
  // // }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <div className={classes.modal_container}>
          <div className={classes.modal_title}>
            <p>공유</p>
            <GoX
              className={classes.modal_svg}
              onClick={handleClose}
            >
            </GoX>
          </div>
          <div className={classes.modal_icon_area}>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#d9d9d9" }}
              onClick={() => handleCopyClipBoard(`${location.pathname}`)}
            >
              <GoLink className={classes.modal_icon_link}></GoLink>
            </div>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#ffcd00" }}
            >
              <BiSolidMessageRounded
                className={classes.modal_icon_kakao}
              >
              </BiSolidMessageRounded>
            </div>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#304d8a" }}
            >
              <BiLogoFacebookCircle
                className={classes.modal_icon_facebook}
                onClick={shareFacebook}
              >
              </BiLogoFacebookCircle>
            </div>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#00aced" }}
            >
              <BiLogoTwitter
                className={classes.modal_icon_twitter}
                onClick={shareTwitter}
              >
              </BiLogoTwitter>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default FundingDetailModal;
