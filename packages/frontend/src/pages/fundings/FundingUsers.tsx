import { Container } from "@/component/Container";
import useFundingUsers from "@/hook/useFundingUsers";
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
    <Container>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>email</th>
            <th>nickname</th>
            <th>address</th>
            <th>phone</th>
            <th>recipient</th>
            <th>reward</th>
            <th>reward price</th>
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
