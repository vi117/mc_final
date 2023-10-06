import clsx from "clsx";
import { useState } from "react";
import { Accordion, Col, Form, Modal, Row } from "react-bootstrap";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { fundingParticipate } from "../../api/funding";
import MyButton from "../../component/Button";
import { Container } from "../../component/Container";
import { useAlertModal } from "../../hook/useAlertModal";
import { useLoginInfo } from "../../hook/useLogin";
import classes from "./FundingsPay.module.css";

export default function FundingsPay() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useLoginInfo();
  const [shippingInfo, setShippingInfo] = useState({
    address: userInfo?.address ?? "",
    addressDetail: userInfo?.address_detail ?? "",
    name: "",
    phone: userInfo?.phone ?? "",
  });
  const { AlertModal, showAlertModal } = useAlertModal();

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  const { funding, selectedReward } = location.state;
  const remainingDays =
    (new Date(funding.end_date).getTime() - new Date().getTime())
    / (1000 * 60 * 60 * 24);

  return (
    <Container>
      <AlertModal />
      <div className="d-flex flex-wrap" style={{ gap: "15px" }}>
        <div
          className={classes["ImgArea"]}
        >
          <NavLink to={`/fundings/${funding.id}`}>
            <img
              src={funding.thumbnail}
              alt={funding.title}
            >
            </img>
          </NavLink>
        </div>
        <div className="d-flex flex-column justify-content-between">
          <div className={classes["styled-project"]}>
            <span className={classes["intro"]}>
              {selectedReward.title} | {funding.host_nickname}
            </span>
            <h3 style={{ marginTop: "10px" }}>
              <NavLink to={`/fundings/${funding.id}`}>{funding.title}</NavLink>
            </h3>
          </div>
          <div className={classes["styled-project"]}>
            <span className={classes["account"]}>
              {funding.current_value} 원
            </span>
            <span className={classes["achivement"]}>
              {((funding.current_value / funding.target_value) * 100).toFixed(
                2,
              )} %
            </span>
            <span className={classes["state"]}>
              {remainingDays.toFixed(2)}일 남음
            </span>
          </div>
        </div>
      </div>
      <Row>
        <Col sm={12} lg={6} className="mb-4">
          <p className={clsx(classes["FundingInfor"], classes["Header"])}>
            펀딩 정보
          </p>
          <div className={classes["container"]}>
            <SelectRewardInfo selectedReward={selectedReward} />
          </div>

          <p className={clsx(classes["AddressInfor"], classes["Header"])}>
            배송 정보
          </p>
          <div className={clsx(classes["Address"], classes["container"])}>
            <ShippingInformation
              setShippingInfo={setShippingInfo}
              shippingInfo={shippingInfo}
            />
          </div>
        </Col>
        <Col sm={12} lg={6} className="mb-4">
          <p className={clsx(classes["Payment"], classes["Header"])}>
            결제수단
          </p>
          <div className={classes["RoundedWrapper"]}>
            <PaymentMethod />
            <CardRegister />
          </div>
          <div className={classes["Sponsorship"]}>
            <p className={classes["FinalAmount"]} style={{ color: "#3A52CA" }}>
              최종 후원 금액
              <span
                style={{
                  color: "#0C0002",
                }}
              >
                {selectedReward.price} 원
              </span>
            </p>
          </div>
          <div className={clsx(classes["PledgeAmount"])}>
            <p style={{ position: "relative", fontSize: "15px" }}>
              * 프로젝트가 무산되거나 중단된 경우 결제는 취소되며 환불
              진행됩니다.
            </p>
            <ConsentForm />
            <FundingPrecaution />
            <PrecautionForm />
            <br></br>
            <div className="mb-2 w-100 d-flex justify-content-center">
              <MyButton
                variant="outlined"
                className="w-100"
                onClick={() => {
                  participate().then(() => {
                    navigate(`/fundings/${funding.id}`);
                  });
                }}
                style={{
                  maxWidth: "300px",
                  height: "50px",
                }}
              >
                후원하기
              </MyButton>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
  async function participate() {
    try {
      await fundingParticipate(funding.id, selectedReward.id, {
        address: shippingInfo.address,
        addressDetail: shippingInfo.addressDetail,
        recipient: shippingInfo.name,
        phone: shippingInfo.phone,
      });
      await showAlertModal("success", "펀딩 후원을 해주었습니다.");
      navigate(`/fundings/${funding.id}`);
    } catch (err) {
      await showAlertModal("error", err.message);
    }
  }
}

function SelectRewardInfo({ selectedReward }) {
  return (
    <table className={classes["fundingInfoTable"]}>
      <tbody>
        <tr>
          <th className={classes["SmallHeader"]}>펀딩 구성</th>
          <td>
            <p className={classes["reward-title"]}>
              {selectedReward.title}
            </p>
            <ul className={classes["reward-list"]}>
              {selectedReward.content}
            </ul>
          </td>
        </tr>
        <tr>
          <th className={classes["SmallHeader"]}>펀딩 금액</th>
          <td>
            <p className={classes["reward-price"]}>
              {selectedReward.price} 원
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function FundingPrecaution() {
  return (
    <Accordion
      style={{ position: "relative", marginBottom: "20px" }}
    >
      <Accordion.Item>
        <Accordion.Header>후원 유의사항</Accordion.Header>
        <Accordion.Body
          style={{ position: "relative", fontSize: "13px" }}
        >
          후원은 구매가 아닌 창의적인 계획에 자금을 지원하는 일입니다.
          HappyTails에서의 후원은 아직 실현되지 않은 프로젝트가 실현될 수 있도록
          제작비를 후원하는 과정으로, 기존의 상품 또는 용역을 거래의 대상으로
          하는 매매와는 차이가 있습니다. 따라서 전자상거래법상 청약철회 등의
          규정이 적용되지 않습니다.
          <br></br>
          <br></br>
          프로젝트는 계획과 달리 진행될 수 있습니다. 예상을 뛰어넘는 멋진 결과가
          나올 수 있지만 진행 과정에서 계획이 지연, 변경되거나 무산될 수도
          있습니다. 본 프로젝트를 완수할 책임과 권리는 창작자에게 있습니다.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

function CardRegister() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <MyButton
        variant="outlined"
        onClick={handleShow}
        style={{ height: "40px", margin: "0px -20px -20px -20px" }}
      >
        + 카드 등록
      </MyButton>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>신용/체크 카드 등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["radio"].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                <Form.Check
                  inline
                  label="개인"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check
                  inline
                  label="법인"
                  name="group1"
                  type={type}
                  id={`inline-${type}-2`}
                />
              </div>
            ))}
          </Form>
          <div className={classes["NumberWrapper"]}>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>카드번호</Form.Label>
                <Form.Control
                  style={{ position: "relative", width: "300px" }}
                  type="number"
                  placeholder="0000-0000-0000-0000 "
                />
              </Form.Group>
            </Form>

            <p>카드 유효기간</p>
            <Form.Select
              aria-label="Default select example"
              style={{ position: "relative", width: "100px" }}
            >
              <option>1월</option>
              <option value="1">2월</option>
              <option value="2">3월</option>
              <option value="3">4월</option>
              <option value="4">5월</option>
              <option value="5">6월</option>
              <option value="6">7월</option>
              <option value="7">8월</option>
              <option value="8">9월</option>
              <option value="9">10월</option>
              <option value="10">11월</option>
              <option value="11">12월</option>
            </Form.Select>

            <Form.Select
              aria-label="Default select example"
              style={{ position: "relative", width: "100px" }}
            >
              <option>2023년</option>
              <option value="1">2024년</option>
              <option value="2">2025년</option>
              <option value="3">2026년</option>
              <option value="4">2027년</option>
              <option value="5">2028년</option>
              <option value="6">2029년</option>
              <option value="7">2030년</option>
              <option value="8">2031년</option>
              <option value="9">2032년</option>
              <option value="10">2033년</option>
            </Form.Select>
            <br></br>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>카드 비밀번호 앞 두자리</Form.Label>
                <Form.Control
                  style={{ position: "relative", width: "300px" }}
                  type="number"
                  placeholder="앞 두자리를 입력해주세요."
                />
              </Form.Group>
            </Form>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>소유주 생년월일</Form.Label>
                <Form.Control
                  style={{ position: "relative", width: "300px" }}
                  type="number"
                  placeholder="예) 920101"
                />
              </Form.Group>
            </Form>
            <Form>
              {["checkbox"].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                  <Form.Check
                    style={{ fontSize: "15px" }}
                    inline
                    label="결정사 정보제공 동의"
                    name="group1"
                    type={type}
                    id={`inline-${type}-1`}
                  />
                </div>
              ))}
            </Form>
            <Form>
              {["checkbox"].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                  <Form.Check
                    style={{ fontSize: "15px" }}
                    inline
                    label="기본 결제수단으로 등록"
                    name="group1"
                    type={type}
                    id={`inline-${type}-1`}
                  />
                </div>
              ))}
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <MyButton
            variant="outlined"
            color="error"
            style={{ right: "8px" }}
            onClick={handleClose}
          >
            취소
          </MyButton>
          <MyButton variant="outlined" onClick={handleClose}>
            등록 완료
          </MyButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ShippingInformation({ shippingInfo, setShippingInfo }) {
  const daumPostcodePopup = useDaumPostcodePopup();
  return (
    <>
      <Form
        className="d-flex flex-column w-100"
        onSubmit={(e) => e.preventDefault()}
      >
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label className={classes["SmallHeader"]}>
              받는 사람
            </Form.Label>
            <Form.Control
              type="Name"
              style={{}}
              className={""}
              placeholder="받는 분 성함을 입력해주세요."
              value={shippingInfo.name}
              onChange={(e) =>
                setShippingInfo({
                  ...shippingInfo,
                  name: e.target.value,
                })}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridNumber">
            <Form.Label className={classes["SmallHeader"]}>
              연락처
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="연락처를 입력해주세요."
              value={shippingInfo.phone}
              onChange={(e) =>
                setShippingInfo({
                  ...shippingInfo,
                  phone: e.target.value,
                })}
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label className={classes["SmallHeader"]}>
            배송지
          </Form.Label>
          <Form.Control
            placeholder="ex) 성남시 분당구 동판교로 115"
            value={shippingInfo.address}
            onClick={() => {
              daumPostcodePopup({
                onComplete: (data) => {
                  setShippingInfo({
                    ...shippingInfo,
                    address: data.address,
                  });
                },
              });
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress2">
          <Form.Label className={classes["SmallHeader"]}>
            상세주소
          </Form.Label>
          <Form.Control
            placeholder="ex) 2층 201호"
            value={shippingInfo.addressDetail}
            onChange={(e) =>
              setShippingInfo({
                ...shippingInfo,
                addressDetail: e.target.value,
              })}
          />
        </Form.Group>
      </Form>
    </>
  );
}

function PaymentMethod() {
  const type = "radio";
  return (
    <Form className="d-flex flex-column w-100 mb-3">
      <div key={`inline-${type}`}>
        <Form.Check
          inline
          label="카드 간편결제"
          name="group1"
          type={type}
          id={`inline-${type}-1`}
        />
        <Form.Check
          inline
          label="네이버페이"
          name="group1"
          type={type}
          id={`inline-${type}-2`}
        />
        <Form.Check
          inline
          label="계좌이체"
          name="group1"
          type={type}
          id={`inline-${type}-3`}
        />
      </div>
    </Form>
  );
}

function ConsentForm() {
  return (
    <Form>
      {["checkbox"].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
          <Form.Check
            style={{ fontSize: "15px" }}
            inline
            label="개인정보 제 3자 제공 동의"
            name="group1"
            type={type}
            id={`inline-${type}-1`}
          />
        </div>
      ))}
    </Form>
  );
}

function PrecautionForm() {
  return (
    <Form>
      {["checkbox"].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
          <Form.Check
            style={{ fontSize: "15px" }}
            inline
            label="후원 유의사항 확인"
            name="group1"
            type={type}
            id={`inline-${type}-1`}
          />
        </div>
      ))}
    </Form>
  );
}
