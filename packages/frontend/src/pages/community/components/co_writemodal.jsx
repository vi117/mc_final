import { Button, Card, Modal } from "react-bootstrap";
import classes from "../styles/community.module.css";

const Cowritemodal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show}>
        <div className={classes["title"]}>
          <p>잠깐! 아직 작성하지 않은 펀딩 후기가 있어요🥺</p>
          <h1>생생한 이용 후기를 들려주세요.</h1>
        </div>
        <div className={classes["selectfundingcardarea"]}>
          <Card className={classes["selectfundingcard"]}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body className={classes["sel_card_body"]}>
              <Card.Title>펀딩 타이틀1</Card.Title>
              <Card.Text>
                펀딩 설명 .. [더보기]
              </Card.Text>
              <Button className={classes["sel_card_btn"]}>지금 작성하기</Button>
            </Card.Body>
          </Card>
          <Card className={classes["selectfundingcard"]}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>펀딩 타이틀1</Card.Title>
              <Card.Text>
                펀딩 설명 .. [더보기]
              </Card.Text>
              <Button className={classes["sel_card_btn"]}>지금 작성하기</Button>
            </Card.Body>
          </Card>
          <Card
            className={classes["selectfundingcard"]}
            style={{ marginRight: "0px !important" }}
          >
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>펀딩 타이틀1</Card.Title>
              <Card.Text>
                펀딩 설명 .. [더보기]
              </Card.Text>
              <Button className={classes["sel_card_btn"]}>지금 작성하기</Button>
            </Card.Body>
          </Card>
        </div>
        <div className={classes["filterbtnarea"]}>
          <button
            className={classes["closebtn"]}
            onClick={handleClose}
            style={{ marginRight: "5px" }}
          >
            나중에 쓸게요
          </button>
        </div>
      </Modal>
    </>
  );
};
export default Cowritemodal;
