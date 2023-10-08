import clsx from "clsx";
import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useLocation, useNavigate } from "react-router-dom";
import { emailCheck, nicknameCheck, signUp } from "../../api/mod";
import Button from "../../component/Button";
import Upload from "../../component/UploadAvatar";
import {
  ValidationInput,
  ValidationInputLabel,
} from "../../component/ValidationInput";
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
    <>
      <div className={classes["register_container"]}>
        <p>이메일 회원가입</p>
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
          <div className={classes.validate_input}>
            <ValidationInputLabel>
              프로필 사진
            </ValidationInputLabel>
            <Upload
              imageFile={profileImageRef}
              initial_preview_URL={location.state?.thumbnail ?? ""}
            />
          </div>
          <ValidationInput
            name="Email"
            type="email"
            label="이메일"
            className={classes.validate_input}
            value={Email}
            placeholder="이메일 주소를 입력해주세요"
            onChange={(value) => setEmail(value)}
            pattern={emailPattern}
            patternMessage="타입이 맞지 않습니다."
            validateAsync={emailCheck}
            validateAsyncMessage={"이미 사용되는 이메일입니다."}
          />
          <ValidationInput
            name="Password"
            label="비밀번호"
            type="password"
            className={classes.validate_input}
            placeholder="비밀번호를 입력해주세요"
            value={Password}
            onChange={(value) => setPassword(value)}
            minLength={6}
            minMessage={"6자리 이상이어야 합니다."}
          />
          <ValidationInput
            name="ConfirmPassword"
            type="password"
            placeholder="비밀번호를 확인합니다"
            className={clsx(
              classes.validate_input,
              classes.validate_input_no_label,
            )}
            value={ConfirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            minLength={6}
            minMessage={"6자리 이상이어야 합니다."}
            validate={(value) => value === Password}
            validateMessage="비밀번호와 비밀번호 확인이 동일해야 합니다."
          />
          <ValidationInput
            name="NickName"
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            className={classes.validate_input}
            type="text"
            value={NickName}
            onChange={(value) => setNickName(value)}
            validateAsync={nicknameCheck}
            validateAsyncMessage={"이미 사용 중인 닉네임입니다."}
          />
          <ValidationInput
            name="Phone"
            label="전화번호"
            placeholder="전화번호를 입력해주세요"
            className={classes.validate_input}
            type="text"
            value={Phone}
            onChange={(value) => setPhone(value)}
          />
          <ValidationInput
            name="Address"
            type="text"
            label="주소"
            className={classes.validate_input}
            placeholder="주소를 입력해주세요"
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
            placeholder="상세주소를 입력해주세요"
            className={clsx(
              classes.validate_input,
              classes.validate_input_no_label,
            )}
            value={AddressDetail}
            onChange={(value) => setAddressDetail(value)}
          />
          <ValidationInput
            name="Introduction"
            type="text"
            label="소개"
            className={classes.validate_input}
            placeholder="간단한 한 마디로 나를 소개해주세요"
            value={Article}
            onChange={(value) => setArticle(value)}
          />
          <Button
            className={classes.button_submit}
            onClick={() => onSubmitHandler()}
          >
            회원가입
          </Button>
        </Form>
      </div>
    </>
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
