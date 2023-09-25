import Accordion from "react-bootstrap/Accordion";
import "./Profile.css";

function AccordionList() {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>관심 펀딩리스트</Accordion.Header>
        <Accordion.Body>
          <table>
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
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>좋아요 게시물</Accordion.Header>
        <Accordion.Body>
          <table>
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
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>오픈한 펀딩</Accordion.Header>
        <Accordion.Body>
          <table>
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">카테고리</th>
                <th scope="col">제목</th>
                <th scope="col">글쓴이</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>어류</td>
                <td>금붕어도 기억하는 사료</td>
                <td>강태공</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>양서류</td>
                <td>피부는 소중하니까</td>
                <td>개굴개굴</td>
              </tr>
            </tbody>
          </table>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>후원한 펀딩</Accordion.Header>
        <Accordion.Body>
          <table>
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">카테고리</th>
                <th scope="col">제목</th>
                <th scope="col">글쓴이</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>어류</td>
                <td>금붕어도 기억하는 사료</td>
                <td>강태공</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>양서류</td>
                <td>피부는 소중하니까</td>
                <td>개굴개굴</td>
              </tr>
            </tbody>
          </table>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionList;
