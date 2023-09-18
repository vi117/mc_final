import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { Accordion, Alert } from "react-bootstrap";
import images from "./images/logo.svg";
import classes from "./withdrawal.module.css";

export default function WithdrawalPage() {
  return (
    <div className={classes["container"]}>
      <h2 style={{ color: "#0C0002" }}>회원 탈퇴</h2>
      <div className={classes["Alert"]}>
        <Alert variant="danger">
          탈퇴 시 전자금융거래법에 따라 금융 거래기록은 5년 뒤 파기됩니다. 다른
          모든 정보는 삭제되며 복구는 불가합니다.
        </Alert>
      </div>
      <div className={classes["img-wrapper"]}>
        <img src={images} alt="logo" />
      </div>
      <h4>탈퇴하기 전 꼭 확인하세요!</h4>
      <p>탈퇴하시면 이용중인 모든 페이지가 폐쇄되며,</p>
      <p>모든 데이터는 복구가 불가능합니다.</p>
      <div className={classes["Accordion"]}>
        <Accordion>
          <Accordion.Header>유의사항을 확인하세요</Accordion.Header>
          <Accordion.Body>
            작성한 글, 펀딩, 프로필 등 모든 정보가 삭제됩니다. <br></br>
            탈퇴 시 전자금융거래법에 따라 금융 거래기록은 5년 뒤 파기됩니다.
            {" "}
            <br></br>
            타인 글의 댓글은 삭제되지 않으니 미리 확인하세요. <br></br>
            그동안 HAPPYTAILS를 이용해주셔서 감사합니다.
          </Accordion.Body>
        </Accordion>
      </div>
      <div className={classes["CheckboxLabels"]}>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="안내사항을 모두 확인하였으며, 이에 동의합니다."
        />
      </div>
      <div className={classes["Button"]}>
        <Button variant="contained">탈퇴하기</Button>
        <Button variant="contained">취소</Button>
      </div>
    </div>
  );
}
