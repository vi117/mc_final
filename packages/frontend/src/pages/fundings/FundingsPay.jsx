import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import classes from "./FundingsPay.module.css";

export default function FundingsPay() {
  const location = useLocation();
  const { funding, selectedReward } = location.state;
  const [address, setAddress] = useState("");

  const remainingDays =
    (new Date(funding.end_date).getTime() - new Date().getTime())
    / (1000 * 60 * 60 * 24);
  return (
    <div className={classes["ImgArea"]}>
      <a herf="">
        <img
          src="https://tumblbug-pci.imgix.net/7cfb3abbd6858246bf2035597db71d580c2d498a/45aaac977a4839c037ae17edf1c6fc60a7808549/7de566a0fc9249d3118ace965b212a7a2271db41/2df1f908-3e53-4cbc-a592-a75990833129.png?auto=format%2Ccompress&amp;fit=crop&amp;h=465&amp;lossless=true&amp;w=620&amp;s=2ec44f003aac8f0499c9d46d72f68d15"
          alt="[댕냥이 위생, 목욕 고민 해결] 100% 국내제작 펫타올 프로젝트 이미지"
        >
        </img>
      </a>
      <div className={classes["styled-project"]}>
        <span className={classes["intro"]}>
          {selectedReward.title} | {funding.host_nickname}
        </span>
        <h3>
          <a href="펀딩.url">
            {funding.title}
          </a>
        </h3>
      </div>
      <div className={classes["styled-project"]}>
        <span className={classes["account"]}>
          {funding.current_value} 원 1,493,600 원
        </span>
        <span className={classes["achivement"]}>
          {(funding.current_value / funding.target_value * 100).toFixed(2)}{" "}
          % 298 %
        </span>
        <span className={classes["state"]}>
          {/* TODO(vi117): 일, 시간, 분 남음으로 바꾸기. 컴포넌트로 추출하고 setInterval로 실시간 갱신. */}
          {remainingDays.toFixed(2)}일 남음
        </span>
      </div>
      <div className={classes["container"]}>
        <table>
          <tbody>
            <tr>
              <th>펀딩 구성</th>
              <td>
                <p>{selectedReward.title}</p>
                <ul className={classes["reward-list"]}>
                  {selectedReward.content}
                </ul>
              </td>
            </tr>
            <tr>
              <th>펀딩 금액</th>
              <td>
                {selectedReward.price} 원
              </td>
            </tr>
          </tbody>
        </table>
        <Button variant="outline-dark">변경</Button>
      </div>
      <div className={classes["Card-Wrapper"]}>
        <p>후원자 정보</p>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>주소</Form.Label>
            <Form.Control
              type="address"
              placeholder="주소를 기재해주세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>
      <Button variant="success" onClick={participate}>참여</Button>
    </div>
  );
  async function participate() {
    const url = new URL(
      `/api/v1/fundings/${funding.id}/rewards/${selectedReward.id}/participate`,
      window.location.href,
    );
    const r = await fetch(url.href, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        address,
      }),
    });
    if (!r.ok) {
      // TODO(vi117): show error message modal
      alert("요청이 실패했습니다.");
      return null;
    }
    // TODO(vi117): navigate funding
    alert("요청이 접수되었습니다.");
  }
}
