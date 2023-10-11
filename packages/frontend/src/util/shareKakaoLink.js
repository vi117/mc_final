export const shareKakao = () => { // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
  if (window.Kakao) {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_API_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
    }

    const currentURL = window.location.href;

    kakao.Link.sendDefault({
      objectType: "feed", // 카카오 링크 공유 여러 type들 중 feed라는 타입 -> 자세한 건 카카오에서 확인
      content: {
        title: "[HAPPYTAILS] 반려동물을 위한 펀딩 진행 중 ", // 인자값으로 받은 title
        description:
          "관심있는 펀딩을 공유합니다. 지금 확인하여 펀딩에 참여해보세요! ", // 인자값으로 받은 title
        imageUrl:
          "https://postfiles.pstatic.net/MjAyMzEwMTFfMzAw/MDAxNjk3MDA1NTQ2ODE2.bnUwpBl6zhSjrAcs-RYtUGq1DsAaymh9h-olS81Hp6Qg.z-UB15mNWP2iUx0prlqHDl1D0RFIdAzfkP_AIg-wM8kg.PNG.godus2793/GHR.png?type=w773",
        link: {
          mobileWebUrl: currentURL, // 인자값으로 받은 route(uri 형태)
          webUrl: currentURL,
        },
      },
    });
  }
};
