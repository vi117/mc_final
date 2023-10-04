import { useRef, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useLocation, useNavigate } from "react-router-dom";
import { emailCheck, nicknameCheck, signUp } from "../../api/mod";
import Upload from "../../component/UploadImage";
import { ValidationInput } from "../../component/ValidationInput";
import { useAlertModal } from "../../hook/useAlertModal";
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
  const { showAlertModal, AlertModal } = useAlertModal();
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
      <AlertModal />
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
          minMessage={"6자리 이상이어야 합니다."}
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
      await showAlertModal(
        "Success",
        "요청이 접수되었습니다. 메일을 확인해주세요.",
      );
      navigate("/login");
    } else {
      await showAlertModal("Fail", msg);
    }
  }
}

export default RegisterPage;
