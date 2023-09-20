import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Upload from "../uploadcomponent/Upload";
import RegisterArgee from "./registerArgeeModal";
import classes from "./registerForm.module.css";

const emailPattern = // eslint-disable-next-line no-useless-escape
  /("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])/;

window.emailPattern = emailPattern;

/**
 * @param formElem{HTMLFormElement}
 */
async function signUp(formElem) {
  const formData = new FormData(formElem);

  const r = await fetch("/api/v1/users/signup", {
    method: "POST",
    body: formData,
  });

  if (r.status === 201) {
    /// 회원가입 성공!
    return true;
  } else {
    /// 회원 가입 실패!
    return false;
  }
}

function RegisterPage() {
  const formRef = useRef(null);
  const [Email, setEmail] = useState("");
  // const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [NickName, setNickName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Article, setArticle] = useState("");
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };
  // const onNameHandler = (event) => {
  //   setName(event.currentTarget.value);
  // };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };
  const onNickNameHandler = (event) => {
    setNickName(event.currentTarget.value);
  };
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
        <RegisterArgee
          show={show}
          backdrop="static"
          keyboard={false}
          handleConfirm={handleClose}
          handleClose={handleClose}
        >
        </RegisterArgee>
        <Upload></Upload>
        {
          /* <RegisterLabel>Name</RegisterLabel>
        <input name="" type="text" value={Name} onChange={onNameHandler} /> */
        }
        <RegisterLabel>Email</RegisterLabel>
        <input
          name="email"
          type="email"
          value={Email}
          onChange={onEmailHandler}
        />
        <RegisterLabel>password</RegisterLabel>
        <input
          name="password"
          type="password"
          value={Password}
          onChange={onPasswordHandler}
        />
        <RegisterLabel>Confirm Password</RegisterLabel>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <RegisterLabel>NickName</RegisterLabel>
        <input
          name="nickname"
          type="text"
          value={NickName}
          onChange={onNickNameHandler}
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
        <button
          id="form-controls"
          type="submit"
          onClick={onSubmitHandler}
          className={classes.button_submit}
        >
          <Link to={`/login`}>회원가입</Link>
        </button>
      </form>
    </div>
  );

  function onSubmitHandler() {
    // if (Password !== ConfirmPassword) {
    //   return alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
    // }

    // if (
    //   !Email
    //   //  !Name ||
    //   || !Password || !ConfirmPassword || !NickName || !Phone
    //   || !Address
    // ) {
    //   return alert("모든 필수 항목을 입력하세요.");
    // }

    // if (!emailPattern.test(Email)) {
    //   return alert("올바른 이메일 주소를 입력하세요.");
    // }

    // const phonePattern = /^01[0-9]\d{3,4}\d{4}$/;
    // if (!phonePattern.test(Phone)) {
    //   return alert("올바른 핸드폰 번호를 입력하세요.");
    // }

    // const passwordPattern = /^[A-Za-z0-9]{8,20}$/;
    // if (!passwordPattern.test(Password)) {
    //   return alert("올바른 비밀번호를 입력하세요.");
    // }

    if (formRef.current) {
      signUp(formRef.current);
    }
  }
}

export default RegisterPage;

function RegisterLabel({ children }) {
  return (
    <label className={classes.label}>
      {children}
    </label>
  );
}
