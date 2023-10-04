export const shareKakao = (route) => { // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
  if (window.Kakao) {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_API_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
    }

    kakao.Link.sendDefault({
      objectType: "feed", // 카카오 링크 공유 여러 type들 중 feed라는 타입 -> 자세한 건 카카오에서 확인
      content: {
        title: "[HAPPYTAILS] 반려동물을 위한 펀딩 진행 중!", // 인자값으로 받은 title
        description: "관심있는 펀딩을 공유합니다. 지금 확인해보세요 ", // 인자값으로 받은 title
        imageUrl:
          "https://s3.prelude.duckdns.org/happytail/0816a03e-72de-4f25-b194-95e06ec70a83.jpg",
        link: {
          mobileWebUrl: route, // 인자값으로 받은 route(uri 형태)
          webUrl: route,
        },
      },
    });
  }
};
