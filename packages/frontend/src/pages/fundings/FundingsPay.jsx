import Button from "@mui/material/Button";
import { useState } from "react";
import { Accordion, Col, Form, Modal, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useLoginInfo } from "../../hook/useLogin";
import classes from "./FundingsPay.module.css";

export default function FundingsPay() {
  const location = useLocation();
  const userInfo = useLoginInfo();
  const [shippingInfo, setShippingInfo] = useState({
    address: userInfo?.address ?? "",
    addressDetail: "",
    name: "",
  });

  if (!userInfo) {
    return <div>로그인이 필요합니다.</div>;
  }

  const { funding, selectedReward } = location.state;
  const remainingDays =
    (new Date(funding.end_date).getTime() - new Date().getTime())
    / (1000 * 60 * 60 * 24);

  return (
    <div
      className={classes["ImgArea"]}
      style={{ paddingLeft: "230px", paddingRight: "230px" }}
    >
      <a herf="">
        <img
          src={funding.thumbnail}
          alt={funding.title}
        >
        </img>
      </a>
      <div className={classes["styled-project"]}>
        <span className={classes["intro"]}>
          {selectedReward.title} | {funding.host_nickname}
        </span>
        <h3>
          <a href="펀딩.url">{funding.title}</a>
        </h3>
      </div>
      <div className={classes["styled-project"]}>
        <span className={classes["account"]}>
          {funding.current_value} 원
        </span>
        <span className={classes["achivement"]}>
          {((funding.current_value / funding.target_value) * 100).toFixed(2)} %
        </span>
        <span className={classes["state"]}>
          {/* TODO(vi117): 일, 시간, 분 남음으로 바꾸기. 컴포넌트로 추출하고 setInterval로 실시간 갱신. */}
          {remainingDays.toFixed(2)}일 남음
        </span>
      </div>
      <p className={classes["FundingInfor"]}>펀딩 정보</p>
      <div className={classes["container"]}>
        <table>
          <tbody>
            <tr>
              <th>펀딩 구성</th>
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
              <th>펀딩 금액</th>
              <td>
                <p className={classes["reward-price"]}>
                  {selectedReward.price} 원
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={classes["AddressInfor"]}>배송 정보</p>
      <div className={classes["Address"]}>
        <ShippingInformation
          setShippingInfo={setShippingInfo}
          shippingInfo={shippingInfo}
        />
      </div>
      <p className={classes["Payment"]}>결제수단</p>
      <div className={classes["RoundedWrapper"]}>
        <PaymentMethod />
        <CardRegister />
      </div>
      <div className={classes["Sponsorship"]}>
        <p className={classes["FinalAmount"]} style={{ color: "#3A52CA" }}>
          최종 후원 금액
          <span
            style={{ position: "relative", left: "180px", color: "#0C0002" }}
          >
            {selectedReward.price} 원
          </span>
        </p>
      </div>
      <div className={classes["PledgeAmount"]}>
        <p style={{ position: "relative", fontSize: "15px" }}>
          * 프로젝트가 무산되거나 중단된 경우 결제는 취소되며 환불 진행됩니다.
        </p>
        <ConsentForm />
        <FundingPrecaution />
        <PrecautionForm />
        <br></br>
        <div className="mb-2">
          <Link to={`/fundings/${funding.id}`}>
            <Button
              variant="outlined"
              onClick={participate}
              style={{ width: "300px", height: "50px", left: "100px" }}
            >
              후원하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
  async function participate() {
    const url = new URL(
      `/api/v1/fundings/${funding.id}/rewards/${selectedReward.id}/participate`,
      window.location.href,
    );
    const r = await fetch(url.href, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        address: shippingInfo.address + shippingInfo.addressDetail,
        recipient: shippingInfo.name,
        // TODO(vi117): phone 입력 추가
        phone: userInfo.phone,
      }),
    });
    if (!r.ok) {
      // TODO(vi117): show error message modal
      alert("요청이 실패했습니다.");
      return null;
    }
    // TODO(vi117): navigate funding
    alert("요청이 접수되었습니다.");
  }
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
      <Button
        variant="outlined"
        onClick={handleShow}
        style={{ width: "550px", height: "40px", right: "20px" }}
      >
        + 카드 등록
      </Button>

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
          <Button
            variant="outlined"
            color="error"
            style={{ right: "8px" }}
            onClick={handleClose}
          >
            취소
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            등록 완료
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ShippingInformation({ shippingInfo, setShippingInfo }) {
  return (
    <>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label style={{ position: "relative", left: "50px" }}>
              받는 사람
            </Form.Label>
            <Form.Control
              type="Name"
              style={{ width: "300px", position: "relative", left: "50px" }}
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
            <Form.Label style={{ position: "relative", left: "50px" }}>
              연락처
            </Form.Label>
            <Form.Control
              type="Number"
              style={{ width: "300px", position: "relative", left: "50px" }}
              placeholder="연락처를 입력해주세요."
              value={shippingInfo.number}
              onChange={(e) =>
                setShippingInfo({
                  ...shippingInfo,
                  number: e.target.value,
                })}
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label style={{ position: "relative", left: "50px" }}>
            배송지
          </Form.Label>
          <Form.Control
            style={{ width: "300px", position: "relative", left: "50px" }}
            placeholder="ex) 성남시 분당구 동판교로 115"
            value={shippingInfo.address}
            onChange={(e) =>
              setShippingInfo({
                ...shippingInfo,
                address: e.target.value,
              })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress2">
          <Form.Label style={{ position: "relative", left: "50px" }}>
            상세주소
          </Form.Label>
          <Form.Control
            style={{ width: "300px", position: "relative", left: "50px" }}
            placeholder="ex) 2층 201호"
            value={shippingInfo.addressDetail}
            onChange={(e) =>
              setShippingInfo({
                ...shippingInfo,
                addressDetail: e.target.value,
              })}
          />
        </Form.Group>

        <Form.Group className="mb-3" id="formGridCheckbox">
          <Form.Check
            style={{ position: "relative", left: "50px", fontSize: "15px" }}
            type="checkbox"
            label="기본 배송지로 등록"
          />
        </Form.Group>

        <Button
          style={{ width: "150px", position: "relative", left: "250px" }}
          variant="outlined"
          type="submit"
        >
          등록 완료
        </Button>
      </Form>
    </>
  );
}

function PaymentMethod() {
  return (
    <Form>
      {["radio"].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
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
      ))}
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
