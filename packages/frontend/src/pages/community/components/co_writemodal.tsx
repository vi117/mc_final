import { FundingObject } from "dto";
import { Button, Modal } from "react-bootstrap";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { DateToString } from "src/hook/util";
import useFunding from "../../../hook/useFundings";
import classes from "../styles/community.module.css";

const Cowritemodal = ({ show, handleClose, handleSelect }: {
  show: boolean;
  handleClose: () => void;
  handleSelect: (funding: DateToString<FundingObject>) => void;
}) => {
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
          <p>아직 작성하지 않은 펀딩 후기가 있어요 🥺</p>
          <h1>생생한 이용 후기를 들려주세요</h1>
        </div>
        {error && <div>에러가 발생했습니다.</div>}
        {isLoading && <div>로딩중...</div>}
        {!isLoading && !error && (
          <div className={classes["selectfundingcardarea"]}>
            {(fundings ?? []).map((funding) => (
              <div key={funding.id} className={classes["selectfundingcard"]}>
                <img
                  className={classes["selectfundingcard-img"]}
                  src={funding.thumbnail}
                />
                <div className={classes["sel_card_body"]}>
                  <p>{funding.title}</p>
                  <div className={classes["sel_card_link"]}>
                    <Link to={`/fundings/${funding.id}`}>[더보기]</Link>
                  </div>
                  <Button
                    className={classes["sel_card_btn"]}
                    onClick={() =>
                      handleSelect(funding)}
                  >
                    <GoArrowRight style={{ marginRight: "5px" }}></GoArrowRight>
                    {" "}
                    지금 작성하기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={classes["filterbtnarea"]}>
          <button
            className={classes["closebtn"]}
            onClick={handleClose}
          >
            나중에 쓸게요
          </button>
        </div>
      </Modal>
    </>
  );
};
export default Cowritemodal;
