// import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

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
            <button>관심리스트</button>
          </li>
          <li>
            <button>좋아요 게시물</button>
          </li>
        </ul>
      </div>
      {/* 오른쪽 */}
      <div className="right_body">
        {/* 위 */}
        <div>
          <p>오위</p>
        </div>
        {/* 아래 */}
        <div>
          <p>오아</p>
        </div>
      </div>
    </div>
  );
}
