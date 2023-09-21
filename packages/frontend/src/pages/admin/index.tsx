import { Badge, Container } from "react-bootstrap";
import useFundingRequest from "../../hook/useFundingRequest";

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
      <div>
        {data && data.map((funding) => {
          return (
            <div key={funding.id}>
              {funding.deleted_at !== null && (
                <div>거부된 펀딩 요청입니다.</div>
              )}
              <div>{funding.funding_state}</div>
              <h1>
                {funding.title}
              </h1>
              {funding.host_email}
              <img src={funding.thumbnail}>
              </img>
              <div dangerouslySetInnerHTML={{ __html: funding.content }}></div>
              <div>{funding.host_nickname}</div>
              <div>목표 {funding.target_value}원</div>
              <div>
                {funding.meta_parsed?.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <button onClick={() => onApproveClick(funding.id)}>승인</button>
              <button onClick={() => onRejectClick(funding.id)}>거부</button>
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
