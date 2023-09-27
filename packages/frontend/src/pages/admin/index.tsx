import Button from "@mui/material/Button";
import { Badge, Container } from "react-bootstrap";
import useFundingRequest from "../../hook/useFundingRequest";
import classes from "./admin.module.css";

export default function AdminPage() {
  const { data, error, isLoading, mutate } = useFundingRequest();

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <Container>
      <h3 className={classes["h3"]}>펀딩 심사 관리</h3>
      <div className={classes["fundingState"]}>
        {data && data.map((funding) => {
          return (
            <div key={funding.id}>
              {funding.deleted_at !== null && (
                <div>거부된 펀딩 요청입니다.</div>
              )}
              <div className={classes["Fundingthumbnail"]}>
                <img src={funding.thumbnail}></img>
                <div>{funding.funding_state}</div>
                <h1 style={{ fontSize: "16px", textAlign: "left" }}>
                  {funding.title}
                </h1>
                <div className={classes["FundingHost"]}>
                  {funding.host_email}
                  <div>{funding.host_nickname}</div>
                  목표 {funding.target_value}원
                </div>
                <div className={classes["FundingTag"]}>
                  {funding.meta_parsed?.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <Button
                  variant="outlined"
                  onClick={() => onApproveClick(funding.id)}
                >
                  승인
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  style={{ left: "5px" }}
                  onClick={() => onRejectClick(funding.id)}
                >
                  거부
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
  async function onApproveClick(id: number) {
    const url = new URL(
      `/api/v1/fundings/request/${id}/approve`,
      window.location.origin,
    );
    const res = await fetch(url.href, {
      method: "POST",
    });
    if (!res.ok) {
      const data = await res.json();
      // TODO(vi117): show error message modal
      alert("요청이 실패했습니다." + data.message);
      return;
    }
    mutate(data?.filter((f) => f.id !== id));
  }
  async function onRejectClick(id: number) {
    const url = new URL(
      `/api/v1/fundings/request/${id}/reject`,
      window.location.origin,
    );
    const res = await fetch(url.href, {
      method: "POST",
    });
    if (!res.ok) {
      // TODO(vi117): show error message modal
      alert("요청이 실패했습니다.");
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
