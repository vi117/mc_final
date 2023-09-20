import { Button, Form } from "react-bootstrap";
import classes from "./FundingsPay.module.css";

export default function FundingsPay() {
  return (
    <div className={classes["ImgArea"]}>
      <a herf="/blulang">
        <img
          src="https://tumblbug-pci.imgix.net/7cfb3abbd6858246bf2035597db71d580c2d498a/45aaac977a4839c037ae17edf1c6fc60a7808549/7de566a0fc9249d3118ace965b212a7a2271db41/2df1f908-3e53-4cbc-a592-a75990833129.png?auto=format%2Ccompress&amp;fit=crop&amp;h=465&amp;lossless=true&amp;w=620&amp;s=2ec44f003aac8f0499c9d46d72f68d15"
          alt="[댕냥이 위생, 목욕 고민 해결] 100% 국내제작 펫타올 프로젝트 이미지"
        >
        </img>
      </a>
      <div className={classes["styled-project"]}>
        <span className={classes["intro"]}>
          반려용품 | 블루랭
        </span>
        <h3>
          <a href="펀딩.url">
            [댕냥이 위생, 목욕 고민 해결] 100% 국내제작 펫타올
          </a>
        </h3>
      </div>
      <div className={classes["styled-project"]}>
        <span className={classes["account"]}>
          1,493,600 원
        </span>
        <span className={classes["achivement"]}>
          298 %
        </span>
        <span className={classes["state"]}>
          16일 남음
        </span>
      </div>
      <div className={classes["container"]}>
        <table>
          <tbody>
            <tr>
              <th>선물 구성</th>
              <td>
                [슈퍼 얼리버드 27% 할인] 세트 A
                <ul className={classes["reward-list"]}>
                  <li>무료배송 (x1)</li>
                  <li>
                    M사이즈 (색상 선택) (x1)
                    <span>
                      옵션 : 화이트
                    </span>
                  </li>
                  <li>S사이즈 (색상 선택) (x1)</li>
                  <span>
                    옵션: 블루
                  </span>
                  <li>
                    [텀블벅 펀딩 오픈 기념 보너스] S자 고리 (X1)
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>선물 금액</th>
              <td>
                29,800 원
              </td>
            </tr>
            <tr>
              <th>예상 전달일</th>
              <td>2023년 12월 2일</td>
            </tr>
          </tbody>
        </table>
        <Button variant="outline-dark">변경</Button>
      </div>
      <div className={classes["Card-Wrapper"]}>
        <p>후원자 정보</p>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupnumber">
            <Form.Label>연락처</Form.Label>
            <Form.Control type="number" placeholder="연락처를 기재해주세요" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일 주소를 기재해주세요"
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

/* http://localhost:5173/fundings/:id/pay */
