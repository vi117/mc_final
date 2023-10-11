import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { fundingApprove, fundingReject } from "../../../src/api/mod";
import useAlertModal from "../../../src/hook/useAlertModal";
import { formatDate } from "./../../util/date";

import useArticleReports from "../../hook/useArticleReports";
import useFundingReports from "../../hook/useFundingReport";
import useFundingRequest from "../../hook/useFundingRequest";

import { Link, useSearchParams } from "react-router-dom";
import { usePromptModal } from "../../hook/usePromptModal";
import classes from "./admin.module.css";

function getStateTextFromFundingState(funding_state: number) {
  return ["승인 대기", "승인됨", "승인 거부됨"][funding_state];
}

function FundingRequestManageTap() {
  const { AlertModal, showAlertModal } = useAlertModal();
  const { showPromptModal, PromptModal } = usePromptModal();
  const { data, error, isLoading, mutate } = useFundingRequest({
    view_all: true,
  });

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <div className={classes["admin_contents_container"]}>
      <AlertModal />
      <PromptModal placeholder="거부 사유" />
      <h3>펀딩 심사 관리</h3>
      <hr></hr>
      <div className={classes["fundingState"]}>
        {data && data.map((funding) => {
          return (
            <div className={classes["fundingState_item"]} key={funding.id}>
              {
                /* <div className={classes["fundingState_value"]}>
              {funding.deleted_at !== null && (
                <div>거부된 펀딩 요청입니다.</div>
              )}
              </div> */
              }
              <div className={classes["fundingState_img"]}>
                <Link to={`/fundings/request/${funding.id}`}>
                  <img src={funding.thumbnail}></img>
                </Link>
              </div>
              <div className={classes["fundingState_text_wrap"]}>
                <div className={classes["fundingState_textarea"]}>
                  <div
                    className={classes[
                      funding.funding_state === 2
                        ? "rejected"
                        : "fundingState_value"
                    ]}
                  >
                    {getStateTextFromFundingState(funding.funding_state)}
                  </div>
                  <Link to={`/fundings/request/${funding.id}`}>
                    <div className={classes["FundingTitle"]}>
                      {funding.meta_parsed?.tags
                        && funding.meta_parsed.tags.some(tag =>
                          tag.trim() !== ""
                        )
                        && (
                          funding.meta_parsed.tags.map((tag) => (
                            <div className={classes["FundingTag"]} key={tag}>
                              [{tag}]
                            </div>
                          ))
                        )}
                      {funding.title}
                    </div>
                  </Link>
                  <table className={classes["funding_profile_table"]}>
                    <tbody>
                      <tr>
                        <td>호스트</td>
                        <td>{funding.host_nickname} ({funding.host_email})</td>
                      </tr>
                      <tr>
                        <td>목표</td>
                        <td>{funding.target_value}원</td>
                      </tr>
                      <tr>
                        <td>펀딩기간</td>
                        <td>
                          {formatDate(funding.begin_date)} ~{" "}
                          {formatDate(funding.end_date)}
                        </td>
                      </tr>
                      <tr>
                        <td>신청일</td>
                        <td>{formatDate(funding.created_at)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={classes["button_area"]}>
                  <button
                    className={classes["button_approve"]}
                    onClick={() => onApproveClick(funding.id)}
                  >
                    승인
                  </button>
                  <button
                    color="error"
                    style={{ left: "5px" }}
                    onClick={() => onRejectClick(funding.id)}
                  >
                    거부
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  async function onApproveClick(id: number) {
    try {
      await fundingApprove(id);
    } catch (e) {
      if (e instanceof Error) {
        await showAlertModal("요청 실패", "요청이 실패했습니다." + e.message);
      } else throw e;
      return;
    }
    mutate(data?.filter((f) => f.id !== id));
  }
  async function onRejectClick(id: number) {
    const reason = await showPromptModal(
      "펀딩 요청 거부",
      "거부 사유를 입력해주세요",
    );
    if (!reason) {
      await showAlertModal("요청 실패", "사유를 입력해주세요.");
      return;
    }
    try {
      await fundingReject(id, reason);
    } catch (e) {
      if (e instanceof Error) {
        await showAlertModal("요청 실패", "요청이 실패했습니다. " + e.message);
      } else throw e;
      return;
    }
    mutate(
      data?.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            deleted_at: new Date().toISOString(),
          };
        }
        return f;
      }),
    );
  }
}

function FundingReportManageTap(
  { expandedContent, toggleExpand }: {
    expandedContent: Record<number, boolean>;
    toggleExpand: (id: number) => void;
  },
) {
  const { data, error, isLoading } = useFundingReports({
    limit: 50,
    offset: 0,
  });
  if (isLoading) {
    // TODO(vi117): 멋진 progress bar
    return <div>로딩중</div>;
  }
  if (error) {
    return <div>에러!</div>;
  }

  return (
    <div className={classes["admin_contents_container"]}>
      <h3>펀딩 신고 관리</h3>
      <hr></hr>
      <table className={classes["report_table"]}>
        <thead>
          <tr>
            <th className={classes["table_num"]}>번호</th>
            <th className={classes["table_title"]}>펀딩 제목</th>
            <th className={classes["table_reason"]}>신고 사유</th>
          </tr>
        </thead>
        {data === undefined ? undefined : data.map((x) => {
          return (
            <tbody key={x.id}>
              <tr>
                <td className={classes["number"]}>1{x.id}</td>
                <td>
                  <Link to={`/fundings/${x.funding_id}`}>
                    {x.funding_title}
                  </Link>
                </td>
                <td className={classes["reason_content"]}>
                  {expandedContent[x.id]
                    ? x.content
                    : x.content.substring(0, 110)}
                  {x.content.length > 110 && (
                    <button
                      className={classes["moreButton"]}
                      onClick={() => toggleExpand(x.id)}
                    >
                      {expandedContent[x.id] ? "[접기]" : (
                        <span>
                          <b>···</b>더보기
                        </span>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

function CommunityReport(
  { expandedContent, toggleExpand }: {
    expandedContent: Record<number, boolean>;
    toggleExpand: (id: number) => void;
  },
) {
  const { data, error, isLoading } = useArticleReports({
    limit: 50,
    offset: 0,
  });

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <div className={classes["admin_contents_container"]}>
      <h3>커뮤니티 신고 관리</h3>
      <hr></hr>
      <table className={classes["report_table"]}>
        <thead>
          <tr>
            <th className={classes["table_num"]}>번호</th>
            <th className={classes["table_title"]}>펀딩 제목</th>
            <th className={classes["table_reason"]}>신고 사유</th>
          </tr>
        </thead>
        {data === undefined ? undefined : data.map((c) => {
          return (
            <tbody key={c.id}>
              <tr>
                <td>{c.id}</td>
                <td>
                  <Link to={`/community/${c.article_id}`}>
                    {c.article_title}
                  </Link>
                </td>
                <td className={classes["reason_content"]}>
                  {expandedContent[c.id]
                    ? c.content
                    : c.content.substring(0, 110)}
                  {c.content.length > 110 && (
                    <button
                      className={classes["moreButton"]}
                      onClick={() => toggleExpand(c.id)}
                    >
                      {expandedContent[c.id] ? "[접기]" : (
                        <span>
                          <b>···</b>더보기
                        </span>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedContent, setExpandedContent] = useState<
    Record<number, boolean>
  >({});

  const toggleExpand = (id: number) => {
    setExpandedContent((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className={classes["admin_container"]}>
      <Tabs
        id="controlled-tab-example"
        activeKey={searchParams.get("key") ?? "request"}
        onSelect={(k) => {
          setSearchParams({ key: k ?? "request" });
        }}
        className={classes["admin_tab_container"]}
      >
        <Tab eventKey="request" title="펀딩 심사">
          <FundingRequestManageTap />
        </Tab>
        <Tab eventKey="report" title="펀딩 신고 관리">
          <FundingReportManageTap
            expandedContent={expandedContent}
            toggleExpand={toggleExpand}
          />
        </Tab>
        <Tab eventKey="co_report" title="커뮤니티 신고 관리">
          <CommunityReport
            expandedContent={expandedContent}
            toggleExpand={toggleExpand}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

/**
 * 펀딩 디테일 페이지에 관리자만 볼 수 있는 비공개 버튼이 있음.
 * - 이 버튼을 누르면 비공개 됨
 * // 비공개 처리가 되면 목록에서 안보이도록 함.
 *
 * 링크가 이미 공유된 페이지로 가면 비공개 페이지라고 안내를 함.
 */
