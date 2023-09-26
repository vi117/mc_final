import { Button } from "react-bootstrap";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";
import classes from "./InterestButton.module.css";

export function InterestButton({ funding, setInterest }: {
  funding: {
    id: number;
    interest_user_id: number | null;
  };
  setInterest: (id: number, like?: boolean) => void;
}) {
  return (
    <>
      {funding.interest_user_id
        ? (
          <Button
            className={classes["interest_btn"]}
            onClick={() => {
              setInterest(funding.id, false);
            }}
          >
            <BiBookmark
              className={classes["btn_svg"]}
            />
          </Button>
        )
        : (
          <Button
            className={classes["interest_btn"]}
            onClick={() => {
              setInterest(funding.id);
            }}
          >
            <BiSolidBookmark
              className={classes["btn_svg"]}
            />
          </Button>
        )}
    </>
  );
}
