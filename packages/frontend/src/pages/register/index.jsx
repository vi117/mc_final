import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import { emailCheck, nicknameCheck, signUp } from "../../api/mod";
import Upload from "../../component/UploadImage";
import RegisterArgee from "./registerArgeeModal";
import classes from "./registerForm.module.css";

const emailPattern = // eslint-disable-next-line no-useless-escape
  /("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])/u;

window.emailPattern = emailPattern;

/**
 * @param formElem{HTMLFormElement}
 */

function RegisterPage() {
  const navigate = useNavigate();
  const DaumPostcodePopup = useDaumPostcodePopup();

  const profileImageRef = useRef(null);
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

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="mb-3"
    >
      <Form
        style={{ display: "flex", flexDirection: "column" }}
        className={classes.form}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <RegisterArgee
          show={show}
          backdrop="static"
          keyboard={false}
          handleConfirm={handleClose}
          handleClose={() => navigate("/login")}
        >
        </RegisterArgee>
        <Upload imageFile={profileImageRef}></Upload>

        <ValidationInput
          name="Email"
          type="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          pattern={emailPattern}
          validateAsync={emailCheck}
        />

        <ValidationInput
          name="Password"
          type="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ValidationInput
          name="ConfirmPassword"
          type="password"
          value={ConfirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          validate={(value) => value === Password}
        />

        <ValidationInput
          name="NickName"
          type="text"
          value={NickName}
          onChange={(e) => setNickName(e.target.value)}
          validateAsync={nicknameCheck}
        />

        <ValidationInput
          name="Phone"
          type="text"
          value={Phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <ValidationInput
          name="Address"
          type="text"
          value={Address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={() => {
            DaumPostcodePopup({
              onComplete(resultAddress) {
                setAddress(resultAddress.address);
              },
            });
          }}
        >
          set Adress
        </button>

        <ValidationInput
          name="Introduction"
          type="text"
          value={Article}
          onChange={(e) => setArticle(e.target.value)}
        />
        <button
          className={classes.button_submit}
          onClick={() => onSubmitHandler()}
        >
          회원가입
        </button>
      </Form>
    </Container>
  );

  async function onSubmitHandler() {
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
    const [result, msg] = await signUp({
      Email,
      Password,
      NickName,
      Phone,
      Address,
      Article,
      ProfileImage: profileImageRef.current,
    });
    if (result) {
      // TODO(vi117): 이메일을 확인하라는 모달을 띄우고 나서 navigate
      navigate("/login");
    } else {
      // TODO(vi117): 나중에 적당한 경고창 띄우기.
      alert("fail" + msg);
    }
  }
}

export default RegisterPage;

function ValidationInput({
  children,
  className,
  name,
  type,
  value,
  onChange,
  pattern,
  validate,
  validateAsync,
}) {
  const checkSync = (value, pattern, validate) => {
    return (pattern?.test(value) ?? true) && (validate?.(value) ?? true);
  };
  const [isValid, setIsValid] = useState(
    checkSync(value, pattern, validate),
  );
  const isEmpty = value === undefined || value?.length === 0;

  useEffect(() => {
    const v = checkSync(value, pattern, validate);
    setIsValid(v);
    if (v && validateAsync) {
      const abortController = new AbortController();
      (async () => {
        try {
          const result = await validateAsync(value, abortController.signal);
          setIsValid(result);
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") {
            // do nothing
          } else {
            throw e;
          }
        }
      })();
      return () => abortController.abort();
    }
  }, [value, validateAsync, pattern, validate]);

  return (
    <>
      <RegisterLabel>{name}</RegisterLabel>
      <Form.Control
        className={clsx(className, {
          [classes.label_error]: !isValid && !isEmpty,
        })}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      >
        {children}
      </Form.Control>
    </>
  );
}

function RegisterLabel({ children }) {
  return (
    <Form.Label
      className={classes.label}
    >
      {children}
    </Form.Label>
  );
}
