import { useRef, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { patchUserInfo } from "../../../api/mod";
import { Button } from "../../../component/Button";
import { ValidationInput } from "../../../component/ValidationInput";
import { useAlertModal } from "../../../hook/useAlertModal";
import { useLoginInfo } from "../../../hook/useLogin";
import classes from "./profileEdit.module.css";

function ProfileEditPage() {
  const loginInfo = useLoginInfo();
  const { showAlertModal, AlertModal } = useAlertModal();

  const formRef = useRef(null);
  const [phone, setPhone] = useState(loginInfo.phone);
  const [address, setAddress] = useState(loginInfo.address);
  const [introduction, setIntroduction] = useState(loginInfo.introduction);
  const daumPostcodePopup = useDaumPostcodePopup();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AlertModal />
      <form
        ref={formRef}
        style={{ display: "flex", flexDirection: "column" }}
        className={classes.form}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <ValidationInput
          name="phone"
          className="mb-3"
          label="전화번호"
          type="text"
          value={phone}
          onChange={(v) => setPhone(v)}
        />
        <ValidationInput
          name="address"
          className="mb-3"
          label="주소"
          type="text"
          value={address}
          onClick={() => {
            daumPostcodePopup({
              onComplete: (data) => {
                setAddress(data.address);
              },
            });
          }}
        />
        <ValidationInput
          name="introduction"
          className="mb-3"
          type="text"
          label="소개"
          value={introduction}
          onChange={v => setIntroduction(v)}
        />

        <Button
          id="form-controls"
          type="submit"
          onClick={() => onSubmitHandler()}
          className={classes.button_submit}
        >
          수정 완료
        </Button>
      </form>
    </div>
  );

  async function onSubmitHandler() {
    try {
      await patchUserInfo(loginInfo.id, {
        phone,
        address,
        introduction,
      });
      await showAlertModal("프로파일 정보 수정", "성공");
    } catch (e) {
      console.log(e);
      await showAlertModal("프로파일 정보 수정", e.message);
    }

    // if (
    //   !Phone || !Address
    // ) {
    //   return alert("모든 필수 항목을 입력하세요.");
    // }

    // const phonePattern = /^01[0-9]\d{3,4}\d{4}$/;
    // if (!phonePattern.test(Phone)) {
    //   return alert("올바른 핸드폰 번호를 입력하세요.");
    // }

    // if (formRef.current) {
    //   edit(formRef.current);
    // }
  }
}

export default ProfileEditPage;
