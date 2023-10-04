import clsx from "clsx";
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
            <BiSolidBookmark
              className={clsx(classes["btn_svg"], classes["svg_active"])}
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
            <BiBookmark
              className={classes["btn_svg"]}
            />
          </Button>
        )}
    </>
  );
}
