import { useState } from "react";
import { Accordion, Button, Col, Form, Modal, Row } from "react-bootstrap";
import classes from "./FundingsPay.module.css";

export default function FundingsPay() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className={classes["ImgArea"]}>
      <a herf="/blulang">
        <img
          src="https://tumblbug-pci.imgix.net/7cfb3abbd6858246bf2035597db71d580c2d498a/45aaac977a4839c037ae17edf1c6fc60a7808549/7de566a0fc9249d3118ace965b212a7a2271db41/2df1f908-3e53-4cbc-a592-a75990833129.png?auto=format%2Ccompress&amp;fit=crop&amp;h=465&amp;lossless=true&amp;w=620&amp;s=2ec44f003aac8f0499c9d46d72f68d15"
          alt="[댕냥이 위생, 목욕 고민 해결] 100% 국내제작 펫타올 프로젝트 이미지"
        >
        </img>
      </a>
      <div className={classes["styled-project"]}>
        <span className={classes["intro"]}>
          반려용품 | 블루랭
        </span>
        <h3>
          <a href="펀딩.url">
            [댕냥이 위생, 목욕 고민 해결] 100% 국내제작 펫타올
          </a>
        </h3>
      </div>
      <div className={classes["styled-project"]}>
        <span className={classes["account"]}>
          1,493,600 원
        </span>
        <span className={classes["achivement"]}>
          298 %
        </span>
        <span className={classes["state"]}>
          16일 남음
        </span>
      </div>
      <div className={classes["container"]}>
        <table>
          <tbody>
            <tr>
              <th>선물 구성</th>
              <td>
                [슈퍼 얼리버드 27% 할인] 세트 A
                <ul className={classes["reward-list"]}>
                  <li>무료배송 (x1)</li>
                  <li>
                    M사이즈 (색상 선택) (x1)
                    <span>
                      옵션 : 화이트
                    </span>
                  </li>
                  <li>S사이즈 (색상 선택) (x1)</li>
                  <span>
                    옵션: 블루
                  </span>
                  <li>
                    [텀블벅 펀딩 오픈 기념 보너스] S자 고리 (X1)
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>선물 금액</th>
              <td>
                29,800 원
              </td>
            </tr>
            <tr>
              <th>예상 전달일</th>
              <td>2023년 12월 2일</td>
            </tr>
          </tbody>
        </table>
        <Button variant="outline-dark">변경</Button>
      </div>
      <div className={classes["Address"]}>
        <p>배송 정보</p>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>받는 사람</Form.Label>
              <Form.Control
                type="Name"
                placeholder="받는 분 성함을 입력해주세요."
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>배송지</Form.Label>
            <Form.Control placeholder="ex) 성남시 분당구 동판교로 115" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridAddress2">
            <Form.Label>상세주소</Form.Label>
            <Form.Control placeholder="ex) 2층 201호" />
          </Form.Group>

          <Form.Group className="mb-3" id="formGridCheckbox">
            <Form.Check type="checkbox" label="기본 배송지로 등록" />
          </Form.Group>

          <Button variant="primary" type="submit">
            등록 완료
          </Button>
        </Form>
      </div>
      <div className={classes["RoundedWrapper"]}>
        <p>결제수단</p>
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
        <Button variant="primary" onClick={handleShow}>
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
                    type="number"
                    placeholder="0000-0000-0000-0000 "
                  />
                </Form.Group>
              </Form>

              <p>카드 유효기간</p>
              <Form.Select aria-label="Default select example">
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

              <Form.Select aria-label="Default select example">
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

              <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>카드 비밀번호 앞 두자리</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="앞 두자리를 입력해주세요."
                  />
                </Form.Group>
              </Form>

              <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>소유주 생년월일</Form.Label>
                  <Form.Control type="number" placeholder="예) 920101" />
                </Form.Group>
              </Form>

              <Form>
                {["checkbox"].map((type) => (
                  <div key={`inline-${type}`} className="mb-3">
                    <Form.Check
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
            <Button variant="secondary" onClick={handleClose}>
              취소
            </Button>
            <Button variant="primary" onClick={handleClose}>
              등록 완료
            </Button>
          </Modal.Footer>
        </Modal>

        <div className={classes["PledgeAmount"]}>
          <p>
            최종 후원 금액
            <span>29,800 원</span>
          </p>
          <div className={classes["PledgeAmount-text"]}></div>
          프로젝트가 무산되거나 중단된 경우 결제는 자동으로 취소됩니다.
          <Form>
            {["checkbox"].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                <Form.Check
                  inline
                  label="개인정보 제 3자 제공 동의"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                />
              </div>
            ))}
          </Form>
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>후원 유의사항</Accordion.Header>
              <Accordion.Body>
                후원은 구매가 아닌 창의적인 계획에 자금을 지원하는 일입니다.
                텀블벅에서의 후원은 아직 실현되지 않은 프로젝트가 실현될 수
                있도록 제작비를 후원하는 과정으로, 기존의 상품 또는 용역을
                거래의 대상으로 하는 매매와는 차이가 있습니다. 따라서
                전자상거래법상 청약철회 등의 규정이 적용되지 않습니다.
                <br></br>
                프로젝트는 계획과 달리 진행될 수 있습니다. 예상을 뛰어넘는 멋진
                결과가 나올 수 있지만 진행 과정에서 계획이 지연, 변경되거나
                무산될 수도 있습니다. 본 프로젝트를 완수할 책임과 권리는
                창작자에게 있습니다.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Form>
            {["checkbox"].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                <Form.Check
                  inline
                  label="후원 유의사항 확인"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                />
              </div>
            ))}
          </Form>
          <div className="mb-2">
            <Button variant="primary" size="lg">
              후원하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* http://localhost:5173/fundings/:id/pay */
