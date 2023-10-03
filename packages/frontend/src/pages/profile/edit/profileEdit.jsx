import { useRef, useState } from "react";
import { Button } from "../../../component/Button";
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

  const formRef = useRef(null);
  const [phone, setPhone] = useState(loginInfo.phone);
  const [address, setAddress] = useState(loginInfo.address);
  const [introduction, setArticle] = useState(loginInfo.phone);

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
      <form
        ref={formRef}
        style={{ display: "flex", flexDirection: "column" }}
        className={classes.form}
        onSubmit={onSubmitHandler}
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
          onClick={onSubmitHandler}
          className={classes.button_submit}
        >
          수정 완료
        </Button>
      </form>
    </div>
  );

  function onSubmitHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    fetch(`/api/v1/users/${loginInfo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        address,
        introduction,
      }),
    }).then((res) => {
      if (res.status === 200) {
        alert("success");
      }
    });
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
