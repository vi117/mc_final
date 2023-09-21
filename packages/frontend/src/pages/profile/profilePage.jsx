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
        </ul>
      </div>
      {/* 오른쪽 */}
      <div className="right_body">
        {/* 위 */}
        <div>
          <p>관심 펀딩리스트</p>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">태그</th>
                <th scope="col">펀딩제목</th>
                <th scope="col">호스트</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>강아지</td>
                <td>호기심가득 장난감</td>
                <td>강형욱</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>고양이</td>
                <td>건강도 챙기는 츄르</td>
                <td>헬로키티</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>조류</td>
                <td>약해진 부리도 다시보자</td>
                <td>조삼래 박사님</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 아래 */}
        <div>
          <p>좋아요 게시물</p>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">카테고리</th>
                <th scope="col">제목</th>
                <th scope="col">글쓴이</th>
                <th scope="col">조회수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>강아지</td>
                <td>귀여운 초코</td>
                <td>초코에몽</td>
                <td>756</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>고양이</td>
                <td>츤데레 고영희씨</td>
                <td>개냥이</td>
                <td>945</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>햄스터</td>
                <td>해바라기씨 먹방</td>
                <td>햄토리</td>
                <td>824</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
