import { withdrawUser } from "@/api/user";
import { Container } from "@/component/Container";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAlertModal from "../../hook/useAlertModal";
import { useLoginInfo } from "../../hook/useLogin";
import classes from "./withdrawal.module.css";

export default function WithdrawalPage() {
  const userInfo = useLoginInfo();
  const navigate = useNavigate();
  const { AlertModal, showAlertModal } = useAlertModal();
  return (
    <Container className={classes["container"]}>
      <AlertModal />
      <h1>회원 탈퇴</h1>
      <hr className={classes["hr"]}></hr>

      <h4>
        {userInfo.nickname} 님, <br></br>서비스 이용에 불편함이 있으신가요?
      </h4>
      <div className={classes["info"]}>
        불편한 사항이 있으시면 언제든 해피테일즈에게 알려주세요.
        <p>
          이메일 상담 <b>info@happytails.kr</b>ㅣ 유선 상담 <b>1234-4567</b>
        </p>
      </div>
      <hr className={classes["hr"]}></hr>
      <div className={classes["alert"]}>
        {
          /* <Alert variant="danger">
          탈퇴 시 전자금융거래법에 따라 금융 거래기록은 5년 뒤 파기됩니다. 다른
          모든 정보는 삭제되며 복구는 불가합니다.
        </Alert> */
        }
        <div>
          <h4>
            탈퇴 전, 유의사항을 <br></br>
            확인해주시기 바랍니다.
          </h4>
        </div>

        <div className={classes["alert_box"]}>
          <h1>계정 및 데이터</h1>
          <ul>
            <li>
              탈퇴하시면 이용중인 모든 페이지가 폐쇄되며,{" "}
              <b>개인 데이터는 복구가 불가능합니다.</b>
            </li>
            <li>프로필 등의 모든 개인 정보가 삭제됩니다.</li>
            <li>
              타인 글의 댓글이나 호스트한 펀딩, 작성한 글 등은 삭제되지 않으니
              탈퇴 전 미리 확인 해주시기 바랍니다.
            </li>
          </ul>

          <h1>후원 및 결제</h1>
          <ul>
            <li>
              <b>이미 결제된 후원은 취소되지 않습니다.</b>
            </li>
            <li>
              관련 법령에 따라 후원 및 후원취소에 관한 기록, 결제 및 선물 전달에
              관한 기록은<b>5년</b>동안 보관됩니다.
            </li>
            <li>
              아직 선물을 받지 못했다면,{" "}
              <b>선물 전달 과정에서 불이익이 발생할 수 있습니다.</b>
            </li>
          </ul>

          <h1>펀딩</h1>
          <ul>
            <li>
              탈퇴하더라도, 이미 펀딩이 종료된 프로젝트에 관한<b>
                창작자의 의무와 책임 조항은 그 효력을 유지합니다.
              </b>
            </li>
          </ul>
        </div>
      </div>

      <div className={classes["checkboxLabels"]}>
        <Form.Check label="탈퇴 유의사항을 모두 확인하였으며, 이에 동의합니다.">
        </Form.Check>

        <div className={classes["button"]}>
          <button onClick={withdrawalAction}>탈퇴하기</button>
        </div>
      </div>
      <hr className={classes["hr"]}></hr>
    </Container>
  );
  async function withdrawalAction() {
    try {
      await withdrawUser();
      navigate("/");
    } catch (e) {
      console.error(e);
      await showAlertModal("탈퇴하기", "오류: " + e.message);
    }
  }
}
