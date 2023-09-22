import { Link } from "react-router-dom";
import AccordionList from "./profileLikeList";

export default function Profile() {
  // Todo:
  //   api 연결 후 닉네임 집어넣기
  //   내가 만든 펀딩 및 후원 펀딩 리스트 연결하기
  return (
    <div className="body">
      {/* 왼쪽 */}
      <div className="left_body">
        <ul className="list">
          <li>nickname</li>
          <li>
            <Link to={`/profile/edit`}>
              <button>내정보 수정</button>
            </Link>
          </li>
          <li>
            <Link to={`/withdraw`}>
              <button>회원탈퇴</button>
            </Link>
          </li>
        </ul>
      </div>
      {/* 오른쪽 */}
      <AccordionList />
    </div>
  );
}
