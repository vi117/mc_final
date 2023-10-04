import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useLocation, useNavigate } from "react-router-dom";
import { emailCheck, nicknameCheck, signUp } from "../../api/mod";
import Upload from "../../component/UploadImage";
import RegisterArgee from "./registerArgeeModal";
import classes from "./registerForm.module.css";

const emailPattern =
  // eslint-disable-next-line no-useless-escape
  /("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])/u;

window.emailPattern = emailPattern;

/**
 * @param formElem{HTMLFormElement}
 */

function RegisterPage() {
  const navigate = useNavigate();
  const DaumPostcodePopup = useDaumPostcodePopup();
  const location = useLocation(null);
  // console.log(location.state);

  const profileImageRef = useRef();

  const [Email, setEmail] = useState(location.state?.email ?? "");
  // const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [NickName, setNickName] = useState("");
  const [Phone, setPhone] = useState();
  const [Address, setAddress] = useState("");
  const [AddressDetail, setAddressDetail] = useState("");
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
        <Upload
          imageFile={profileImageRef}
          initial_preview_URL={location.state?.thumbnail ?? ""}
        >
        </Upload>

        <ValidationInput
          name="Email"
          type="email"
          value={Email}
          onChange={(value) => setEmail(value)}
          pattern={emailPattern}
          patternMessage="타입이 맞지 않습니다."
          validateAsync={emailCheck}
          validateAsyncMessage={"이미 사용되는 이메일입니다."}
        />

        <ValidationInput
          name="Password"
          type="password"
          value={Password}
          onChange={(value) => setPassword(value)}
          minLength={6}
          minMessage={"6자리 이상이어야 합니다."}
        />

        <ValidationInput
          name="ConfirmPassword"
          type="password"
          value={ConfirmPassword}
          onChange={(value) => setConfirmPassword(value)}
          minLength={6}
          validate={(value) => value === Password}
          validateMessage="비밀번호와 비밀번호 확인이 동일해야 합니다."
        />

        <ValidationInput
          name="NickName"
          type="text"
          value={NickName}
          onChange={(value) => setNickName(value)}
          validateAsync={nicknameCheck}
          validateAsyncMessage={"닉네임이 중복됩니다."}
        />

        <ValidationInput
          name="Phone"
          type="text"
          value={Phone}
          onChange={(value) => setPhone(value)}
        />

        <ValidationInput
          name="Address"
          type="text"
          value={Address}
          onChange={(value) => setAddress(value)}
          onClick={() => {
            DaumPostcodePopup({
              onComplete(resultAddress) {
                setAddress(resultAddress.address);
              },
            });
          }}
        />
        <ValidationInput
          name=""
          type="text"
          placeholder="상세주소"
          value={AddressDetail}
          onChange={(value) => setAddressDetail(value)}
        />

        <ValidationInput
          name="Introduction"
          type="text"
          value={Article}
          onChange={(value) => setArticle(value)}
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
      AddressDetail,
      Article,
      ProfileImage: profileImageRef.current,
      token: location.state?.token,
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

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 *
 * @param {Object} props - The input object containing the following properties:
 * @param {ReactNode} props.children - The child components.
 * @param {string} props.className - The CSS class name.
 * @param {string} props.name - The name of the input.
 * @param {string} [props.type] - The type of the input.
 * @param {string} props.value - The value of the input.
 * @param {(value: string)=>void} props.onChange - The function called when the input value changes.
 * @param {number} [props.minLength] - The minimum length of the input value.
 * @param {string} [props.minMessage] - The error message for the minimum length validation.
 * @param {RegExp} [props.pattern] - The regular expression to validate the input.
 * @param {string} [props.patternMessage] - The error message for the regular expression validation.
 * @param {((value: string) => boolean)} [props.validate] - The synchronous validation function.
 * it returns true when the validation is successful. returns false or throws an error when the validation fails.
 * @param {string} [props.validateMessage] - The error message for synchronous validation.
 * @param {(value: string, signal: AbortSignal) => Promise<boolean>} [props.validateAsync] - The asynchronous validation function.
 * @param {string} [props.validateAsyncMessage] - The error message for asynchronous validation.
 * @param {string} props.placeholder - The placeholder text for the input.
 * @param {function} props.onClick - The function called when the input is clicked.
 * @return {ReactNode} - The rendered JSX of the ValidationInput component.
 */
function ValidationInput({
  children,
  className,
  name,
  type,
  value,
  onChange,

  minLength,
  minMessage,

  pattern,
  patternMessage,

  validate,
  validateMessage,

  validateAsync,
  validateAsyncMessage,

  placeholder,
  onClick,
}) {
  /**
   * checkSyncAndMessage - Checks the input value and returns an error message if it is not valid.
   * @param {string} value
   * @return {string|undefined}
   */
  const checkSyncAndMessage = useCallback(
    (value) => {
      if (minLength !== undefined && value.length < minLength) {
        return minMessage;
      }
      if (pattern !== undefined && !pattern.test(value)) {
        return patternMessage;
      }
      try {
        if (validate !== undefined && !validate(value)) {
          return validateMessage;
        }
      } catch (e) {
        if (e instanceof Error) {
          return e.message;
        } else {
          throw e;
        }
      }
      return undefined;
    },
    [minLength, pattern, validate, validateMessage, minMessage, patternMessage],
  );

  const checkSync = useCallback((value) => {
    return checkSyncAndMessage(value) === undefined;
  }, [checkSyncAndMessage]);

  const [isValid, setIsValid] = useState(
    checkSync(value),
  );
  const [errorMessage, setErrorMessage] = useState("");
  const isEmpty = value === undefined || value?.length === 0;

  useEffect(() => {
    const v = checkSyncAndMessage(value);
    setIsValid(v === undefined);
    if (v !== undefined) {
      setErrorMessage(v);
    }

    // sync check 통과했을 때 validateAsync가 있으면 시도.
    if (v === undefined && !isEmpty && validateAsync) {
      const abortController = new AbortController();

      (async () => {
        try {
          const result = await validateAsync(value, abortController.signal);
          setIsValid(result);
          console.log(result);
          if (!result) {
            setErrorMessage(validateAsyncMessage);
          } else {
            setErrorMessage("");
          }
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
  }, [
    checkSyncAndMessage,
    validateAsync,
    validateAsyncMessage,
    value,
    isEmpty,
  ]);

  return (
    <>
      <ValidationInputLabel>{name}</ValidationInputLabel>
      <Form.Control
        className={clsx(className, {
          [classes.label_error]: !isValid && !isEmpty,
        })}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onClick={onClick}
      >
        {children}
      </Form.Control>
      {(!isValid && !isEmpty)
        ? <div className="error-message">#{errorMessage}</div>
        : null}
    </>
  );
}

function ValidationInputLabel({ children }) {
  return (
    <Form.Label
      className={classes.label}
    >
      {children}
    </Form.Label>
  );
}
