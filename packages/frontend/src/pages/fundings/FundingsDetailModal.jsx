import { Modal } from "react-bootstrap";
import {
  BiLogoFacebookCircle,
  BiLogoTwitter,
  BiSolidMessageRounded,
} from "react-icons/bi";
import { GoLink, GoX } from "react-icons/go";
import { useLocation } from "react-router-dom";
import classes from "./FundingsDetail.module.css";

const FundingDetailModal = ({ show, handleClose }) => {
  const location = useLocation();
  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었어요.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <div className={classes.modal_container}>
          <div className={classes.modal_title}>
            <p>공유</p>
            <GoX
              className={classes.modal_svg}
              onClick={handleClose}
            >
            </GoX>
          </div>
          <div className={classes.modal_icon_area}>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#d9d9d9" }}
              onClick={() => handleCopyClipBoard(`${location.pathname}`)}
            >
              <GoLink className={classes.modal_icon_link}></GoLink>
            </div>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#ffcd00" }}
            >
              <BiSolidMessageRounded
                className={classes.modal_icon_kakao}
              >
              </BiSolidMessageRounded>
            </div>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#304d8a" }}
            >
              <BiLogoFacebookCircle
                className={classes.modal_icon_facebook}
              >
              </BiLogoFacebookCircle>
            </div>
            <div
              className={classes.modal_icon}
              style={{ backgroundColor: "#00aced" }}
            >
              <BiLogoTwitter
                className={classes.modal_icon_twitter}
              >
              </BiLogoTwitter>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default FundingDetailModal;
