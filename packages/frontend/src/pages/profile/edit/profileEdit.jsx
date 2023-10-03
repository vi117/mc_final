import { useRef, useState } from "react";
import { patchUserInfo } from "../../../api/mod";
import { Button } from "../../../component/Button";
import { useAlertModal } from "../../../hook/useAlertModal";
import { useLoginInfo } from "../../../hook/useLogin";
import classes from "../../register/registerForm.module.css";

/**
 * @param formElem{HTMLFormElement}
 */
// async function edit(formElem) {
//   const formData = new FormData(formElem);

//   const r = await fetch("/api/v1/users", {
//     method: "POST",
//     body: formData,
//   });

//   if (r.status === 201) {
//     /// 내정보 수정 성공!
//     return true;
//   } else {
//     /// 내정보 수정 실패!
//     return false;
//   }
// }

function ProfileEditPage() {
  const loginInfo = useLoginInfo();
  const { showAlertModal, AlertModal } = useAlertModal();

  const formRef = useRef(null);
  const [phone, setPhone] = useState(loginInfo.phone);
  const [address, setAddress] = useState(loginInfo.address);
  const [introduction, setArticle] = useState(loginInfo.introduction);

  const onPhoneHandler = (event) => {
    setPhone(event.currentTarget.value);
  };
  const onAddressHandler = (event) => {
    setAddress(event.currentTarget.value);
  };
  const onArticleHandler = (event) => {
    setArticle(event.currentTarget.value);
  };

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
        <RegisterLabel>Phone</RegisterLabel>
        <input
          name="phone"
          type="text"
          value={phone}
          onChange={onPhoneHandler}
        />
        <RegisterLabel>Address</RegisterLabel>
        <input
          name="address"
          type="text"
          value={address}
          onChange={onAddressHandler}
        />
        <RegisterLabel>Introduction</RegisterLabel>
        <input
          name="introduction"
          type="text"
          value={introduction}
          onChange={onArticleHandler}
        />
        <br />

        <Button
          id="form-controls"
          type="submit"
          onClick={(e) => onSubmitHandler(e)}
          className={classes.button_submit}
        >
          수정 완료
        </Button>
      </form>
    </div>
  );

  async function onSubmitHandler(e) {
    e.preventDefault();
    e.stopPropagation();
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

function RegisterLabel({ children }) {
  return (
    <label className={classes.label}>
      {children}
    </label>
  );
}
