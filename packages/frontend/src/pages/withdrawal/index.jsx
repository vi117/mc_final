import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { Alert } from "react-bootstrap";
import images from "./images/logo.svg";
import classes from "./withdrawal.module.css";

export default function WithdrawalPage() {
  return (
    <div className={classes["container"]}>
      <h2 style={{ color: "#1877F2" }}>회원 탈퇴</h2>
      <Alert variant="danger">
        탈퇴 시 전자금융거래법에 따라 금융 거래기록은 5년 뒤 파기됩니다. 다른
        모든 정보는 삭제되며 복구는 불가합니다.
      </Alert>
      <div className={["img-wrapper"]}>
        <img src={images} alt="logo" />
      </div>
      <h4>HappyTails 탈퇴전 꼭 확인하세요</h4>
      <p>탈퇴하시면 이용중인 모든 페이지가 폐쇄되며,</p>
      <p>모든 데이터는 복구가 불가능합니다.</p>

      <div className={classes["CheckboxLabels"]}>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="안내사항을 모두 확인하였으며, 이에 동의합니다."
        />

        <Button variant="contained">
          탈퇴하기
        </Button>
        <Button variant="contained">취소</Button>
      </div>
    </div>
  );
}

/**
 * npm i vite-plugin-svgr
 *
 * vscode gitLens
 *
 * http://localhost:5173/withdraw
 *
 * fst(a,b) = a
 * snd(a,b) = b
 */
