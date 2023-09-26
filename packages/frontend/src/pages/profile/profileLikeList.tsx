import { Accordion, Badge, Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";
import useFundings from "../../hook/useFundings";
import useLikedArticles from "../../hook/useLikedArticles";
import "./Profile.css";
import { useLoginInfo } from "../../hook/useLogin";

function FundingTable({
  data,
  isLoading = false,
  error = false,
}: {
  data: ReturnType<typeof useFundings>["data"];
  isLoading?: boolean;
  error?: boolean;
}) {
  if (isLoading) {
    return (
      <table>
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">태그</th>
            <th scope="col">제목</th>
            <th scope="col">글쓴이</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((index) => (
            <tr key={index}>
              <Placeholder as="th" scope="row" animation="glow">
                <Placeholder style={{ width: "20px" }} />
              </Placeholder>
              <Placeholder as="td" animation="glow">
                <Placeholder style={{ width: "50px" }} />
              </Placeholder>
              <Placeholder as="td" animation="glow">
                <Placeholder style={{ width: "100px" }} />
              </Placeholder>
              <Placeholder as="td" animation="glow">
                <Placeholder style={{ width: "50px" }} />
              </Placeholder>
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
          <th scope="col">태그</th>
          <th scope="col">제목</th>
          <th scope="col">글쓴이</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((article) => (
          <tr key={article.id}>
            <th scope="row">{article.id}</th>
            <td>
              {article.tags.map((tag) => <Badge key={tag.id}>#{tag.tag}
              </Badge>)}
            </td>
            <td>
              <Link to={`/fundings/${article.id}`}>{article.title}</Link>
            </td>
            <td>{article.host_nickname}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UserOpenedFundings() {
  const userInfo = useLoginInfo();
  const { data, error, isLoading } = useFundings({ host_id: userInfo?.id });
  return <FundingTable data={data} isLoading={isLoading} error={error} />;
}

function UserInterestedFundings() {
  const { data, error, isLoading } = useFundings({ interest: true });
  return <FundingTable data={data} isLoading={isLoading} error={error} />;
}

function UserParticipatedFundings() {
  const { data, error, isLoading } = useFundings({ participated: true });
  return <FundingTable data={data} isLoading={isLoading} error={error} />;
}

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
            <td>
              <Link to={`/community/${article.id}`}>{article.title}</Link>
            </td>
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
          <UserInterestedFundings />
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
          <UserOpenedFundings />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>후원한 펀딩</Accordion.Header>
        <Accordion.Body>
          <UserParticipatedFundings />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionList;
