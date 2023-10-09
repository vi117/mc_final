import useFundingRequest from "@/hook/useFundingRequest";
import { Accordion, Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";
import useFundings from "../../hook/useFundings";
import useLikedArticles from "../../hook/useLikedArticles";
import { useLoginInfo } from "../../hook/useLogin";
import classes from "./profilePage.module.css";

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
    <table className={classes["accordion_table"]}>
      <thead>
        <tr>
          <th className={classes["accordion_th_tags"]} scope="col">펀딩</th>
          <th scope="col">창작자</th>
          <th className={classes["accordion_th_time"]} scope="col">기한</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((article) => {
          const restTime = new Date(article.end_date).getTime()
            - new Date().getTime();
          return (
            <tr key={article.id}>
              <Link to={`/fundings/${article.id}`}>
                <td className={classes["accordion_table_title"]}>
                  <div className={classes["table_funding_tags"]}>
                    {article.tags.slice(0, 3).map((tag) => (
                      <div key={tag.id}>[{tag.tag}]</div>
                    ))}
                  </div>
                  <p>{article.title}</p>
                </td>
              </Link>
              <td className={classes["accordion_table_created"]}>
                {article.host_nickname}
              </td>
              <td className={classes["accordion_table_time"]}>
                {restTime / (1000 * 60 * 60 * 24) > 0
                  ? (
                    <>
                      <div className={classes["accordion_table_resttime"]}>
                        <b>{(restTime / (1000 * 60 * 60 * 24)).toFixed(0)}</b>
                        일 남음
                      </div>
                    </>
                  )
                  : (
                    <>
                      <div className={classes["accordion_table_end"]}>
                        종료
                      </div>
                    </>
                  )}
              </td>
            </tr>
          );
        })}
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

function UserFundingRequests() {
  const { data, error, isLoading } = useFundingRequest({
    limit: 50,
  });
  if (isLoading) {
    <table>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">상태</th>
          <th scope="col">제목</th>
          <th scope="col">사유</th>
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
                <Placeholder style={{ width: "30px" }} />
              </Placeholder>
            </td>
            <td>
              <Placeholder animation="glow">
                <Placeholder style={{ width: "200px" }} />
              </Placeholder>
            </td>
            <td>
              <Placeholder animation="glow">
                <Placeholder style={{ width: "100px" }} />
              </Placeholder>
            </td>
          </tr>
        ))}
      </tbody>
    </table>;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <table className={classes["accordion_table"]}>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">상태</th>
          <th scope="col">제목</th>
          <th scope="col">사유</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((fr) => (
          <tr key={fr.id}>
            <td scope="row">{fr.id}</td>
            <td
              className={classes[
                fr.funding_state === 0
                  ? "pending"
                  : fr.funding_state === 1
                  ? "approved"
                  : fr.funding_state === 2
                  ? "rejected"
                  : ""
              ]}
            >
              <div className={classes["funding_state_container"]}>
                {["보류", "승인", "거부됨"][fr.funding_state]}
              </div>
            </td>
            <td>
              {fr.title}
            </td>
            <td>{fr.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
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
    <table className={classes["accordion_table"]}>
      <thead>
        <tr>
          <th scope="col">카테고리</th>
          <th scope="col">제목</th>
          <th scope="col">글쓴이</th>
        </tr>
      </thead>
      <tbody>
        {likedArticles?.map((article) => (
          <tr key={article.id}>
            <td>{article.category}</td>
            <td>
              <Link to={`/community/${article.id}`}>{article.title}</Link>
            </td>
            <td>{article.author_nickname}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AccordionList() {
  return (
    <Accordion
      defaultActiveKey="0"
      className={classes["profile_accordion_container"]}
    >
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
      <Accordion.Item eventKey="4">
        <Accordion.Header>올린 펀딩 요청</Accordion.Header>
        <Accordion.Body>
          <UserFundingRequests />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionList;
