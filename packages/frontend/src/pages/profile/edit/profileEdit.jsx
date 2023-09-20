import { useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  const formRef = useRef(null);
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Article, setArticle] = useState("");

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
      >
        <RegisterLabel>Email</RegisterLabel>
        <input
          name="email"
          type="email"
          value={"admin@gmail.com"}
          disabled
        />
        <RegisterLabel>NickName</RegisterLabel>
        <input
          name="nickname"
          type="text"
          value={"홍길동"}
          disabled
        />
        <RegisterLabel>Phone</RegisterLabel>
        <input
          name="phone"
          type="text"
          value={Phone}
          onChange={onPhoneHandler}
        />
        <RegisterLabel>Address</RegisterLabel>
        <input
          name="address"
          type="text"
          value={Address}
          onChange={onAddressHandler}
        />
        <RegisterLabel>Article</RegisterLabel>
        <input
          name="introduction"
          type="text"
          value={Article}
          onChange={onArticleHandler}
        />
        <br />

        <Link to={`/profile`}>
          <button
            id="form-controls"
            type="submit"
            onClick={onSubmitHandler}
            className={classes.button_submit}
          >
            수정 완료
          </button>
        </Link>
      </form>
    </div>
  );

  function onSubmitHandler() {
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
