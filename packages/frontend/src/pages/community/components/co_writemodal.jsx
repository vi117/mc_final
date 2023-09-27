import { Button, Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import useFunding from "../../../hook/useFundings";
import classes from "../styles/community.module.css";

const Cowritemodal = ({ show, handleClose }) => {
  const { data: fundings, error, isLoading } = useFunding({
    limit: 3,
    offset: 0,
    participated: true,
    reviewed: "not_reviewed",
  });
  return (
    <>
      <Modal show={show}>
        <div className={classes["title"]}>
          <p>잠깐! 아직 작성하지 않은 펀딩 후기가 있어요🥺</p>
          <h1>생생한 이용 후기를 들려주세요.</h1>
        </div>
        {error && <div>에러가 발생했습니다.</div>}
        {isLoading && <div>로딩중...</div>}
        {!isLoading && !error && (
          <div className={classes["selectfundingcardarea"]}>
            {fundings.map((funding) => (
              <Card key={funding.id} className={classes["selectfundingcard"]}>
                <Card.Img variant="top" src={funding.thumbnail} />
                <Card.Body className={classes["sel_card_body"]}>
                  <Card.Title>{funding.title}</Card.Title>
                  <Card.Text>
                    <Link to={`/fundings/${funding.id}`}>[더보기]</Link>
                  </Card.Text>
                  <Button className={classes["sel_card_btn"]}>
                    지금 작성하기
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
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
