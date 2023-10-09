import Upload from "@/component/UploadAvatar";
import clsx from "clsx";
import { useRef, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { NavLink } from "react-router-dom";
import { patchUserInfo } from "../../../api/mod";
import { Button } from "../../../component/Button";
import {
  ValidationInput,
  ValidationInputLabel,
} from "../../../component/ValidationForm/Input";
import { useAlertModal } from "../../../hook/useAlertModal";
import { useLoginInfo } from "../../../hook/useLogin";
import classes from "./profileEdit.module.css";

function ProfileEditPage() {
  const loginInfo = useLoginInfo();
  const { showAlertModal, AlertModal } = useAlertModal();
  const formRef = useRef(null);
  const [nickname, setNickName] = useState(loginInfo.nickname);
  const [phone, setPhone] = useState(loginInfo.phone);
  const [address, setAddress] = useState(loginInfo.address);
  const [addressDetail, setAddressDetail] = useState(loginInfo.address_detail);
  const [introduction, setIntroduction] = useState(loginInfo.introduction);
  const daumPostcodePopup = useDaumPostcodePopup();
  const profileImageRef = useRef(null);

  return (
    <div className={classes["profileedit_container"]}>
      <p>회원정보 수정</p>
      <div className={classes["profile_info"]}>
        <p>어떤 정보가 프로필에 공개되나요?</p>
        프로필 사진과 닉네임, 소개글, 회원님과 관련된 펀딩 등이{" "}
        <br />프로필 페이지에 공개 됩니다.
        <NavLink
          to={`/host-profile/${loginInfo.id}`}
          className={classes["profile_link"]}
        >
          내 프로필 바로가기
        </NavLink>
      </div>
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
        <ValidationInputLabel className={classes.validate_input}>
          프로필 사진
        </ValidationInputLabel>
        <Upload
          imageFile={profileImageRef}
          initial_preview_URL={loginInfo?.profile_image ?? ""}
        />
        <ValidationInput
          name="nickname"
          className={classes.validate_input}
          type="text"
          placeholder="닉네임을 입력해주세요."
          label="닉네임"
          value={nickname}
          onChange={v => setNickName(v)}
        />
        <ValidationInput
          className={classes.validate_input}
          name="phone"
          label="전화번호"
          type="text"
          placeholder="전화번호를 입력해주세요."
          value={phone}
          onChange={(v) => setPhone(v)}
        />
        <ValidationInput
          name="address"
          className={classes.validate_input}
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
          name="addressDetail"
          className={clsx(
            classes.validate_input,
            classes.validate_input_no_label,
          )}
          type="text"
          placeholder="상세주소를 입력해주세요."
          label=""
          value={addressDetail}
          onChange={(v) => setAddressDetail(v)}
        />

        <ValidationInput
          name="introduction"
          className={classes.validate_input}
          type="text"
          placeholder="간단한 한 마디로 나를 소개해주세요"
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
        nickname,
        phone,
        address,
        address_detail: addressDetail,
        introduction,
        profile_image: profileImageRef.current ?? undefined,
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
