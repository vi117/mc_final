import { Container } from "@/component/Container";
import useFundingUsers from "@/hook/useFundingUsers";
import { RiFileExcel2Line } from "react-icons/ri";
import { useParams } from "react-router-dom";

import classes from "./FundingUsers.module.css";

export default function FundingUsersPage() {
  const params = useParams();
  const id = parseInt(params.id ?? "NaN");
  const { data: plist, error, isLoading } = useFundingUsers(id);
  if (error) {
    return <div>에러! : {error.message}</div>;
  }
  if (isLoading) {
    // TODO(vi117): 멋진 progress bar
    return <div>로딩중</div>;
  }
  return (
    <Container style={{ overflowX: "auto" }}>
      <a
        href={`/api/v1/fundings/${id}/users?csv=true`}
        download="참여자 정보.csv"
      >
        <RiFileExcel2Line
          className={classes.logo_excel}
        />
        <span className={classes.a}>
          엑셀 파일로 출력
        </span>
      </a>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>메일주소</th>
            <th>닉네임</th>
            <th>배송주소</th>
            <th>연락처</th>
            <th>받는사람</th>
            <th>선택 리워드</th>
            <th>리워드 금액</th>
          </tr>
        </thead>
        <tbody>
          {plist?.map((p) => (
            <tr key={p.user_id}>
              <td>{p.user_email}</td>
              <td>{p.user_nickname}</td>
              <td>{p.address}</td>
              <td>{p.phone}</td>
              <td>{p.recipient}</td>
              <td>{p.reward_title}-{p.reward_content}</td>
              <td>{p.reward_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
