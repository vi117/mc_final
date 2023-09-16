import { useState } from "react";
import Upload from "../uploadcomponent/Upload";
import "./registerForm.css";

function RegisterPage() {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [NickName, setNickName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Article, setArticle] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };
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
  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
    }

    if (
      !Email || !Name || !Password || !ConfirmPassword || !NickName || !Phone
      || !Address
    ) {
      return alert("모든 필수 항목을 입력하세요.");
    }

    const emailPattern = // eslint-disable-next-line no-useless-escape
      /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/;
    if (!emailPattern.test(Email)) {
      return alert("올바른 이메일 주소를 입력하세요.");
    }

    const phonePattern = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phonePattern.test(Phone)) {
      return alert("올바른 핸드폰 번호를 입력하세요.");
    }

    const passwordPattern = /^[A-Za-z0-9]{8,20}$/;
    if (!passwordPattern.test(Password)) {
      return alert("올바른 비밀번호를 입력하세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Upload></Upload>
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <label>NickName</label>
        <input type="text" value={NickName} onChange={onNickNameHandler} />
        <label>Phone</label>
        <input type="text" value={Phone} onChange={onPhoneHandler} />
        <label>Address</label>
        <input type="text" value={Address} onChange={onAddressHandler} />
        <label>Article</label>
        <input type="text" value={Article} onChange={onArticleHandler} />
        <br />
        <button id="form-controls" onClick={onSubmitHandler}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
