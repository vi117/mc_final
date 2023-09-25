import { Accordion, Placeholder } from "react-bootstrap";
import useLikedArticles from "../../hook/useLikedArticles";

import "./Profile.css";

function LikedArticlesList() {
  const {
    data: likedArticles,
    error,
    isLoading,
  } = useLikedArticles();
  if (isLoading) {
    return (
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
          {[1, 2, 3].map((key) => (
            <tr key={key}>
              <th scope="row">
                <Placeholder animation="glow">
                  <Placeholder style={{ width: "20px" }} />
                </Placeholder>
              </th>
              <td>
                <Placeholder animation="glow">
                  <Placeholder style={{ width: "40px" }} />
                </Placeholder>
              </td>
              <td>
                <Placeholder animation="glow">
                  <Placeholder style={{ width: "200px" }} />
                </Placeholder>
              </td>
              <td>
                <Placeholder animation="glow">
                  <Placeholder style={{ width: "30px" }} />
                </Placeholder>
              </td>
              <td>
                <Placeholder animation="glow">
                  <Placeholder style={{ width: "30px" }} />
                </Placeholder>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
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
        {likedArticles?.map((article) => (
          <tr key={article.id}>
            <th scope="row">{article.id}</th>
            <td>{article.category}</td>
            <td>{article.title}</td>
            <td>{article.author_nickname}</td>
            <td>{article.view_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

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
          <LikedArticlesList />
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
