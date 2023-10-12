import { NavLink, useSearchParams } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import classes from "./FundingsHome.module.css";

import "../community/styles/tags.css";
import { GoArrowRight } from "react-icons/go";
import { Container } from "../../component/Container";
import { FundingList } from "./component/FundingList";
// import FundingsHome_placeholder from "./FundingsHome_placeholder";

const FundingsHome = function() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.getAll("tag");

  return (
    <Container>
      <div className={classes["funding_navarea"]}>
        <div className={classes["funding_tagsearch"]}>
          <TagsInput
            classNames={{
              input: classes["funding_taginput"],
              tag: classes["funding_tag"],
            }}
            value={selected}
            onChange={(v) => {
              if (
                selected.length === v.length
                && selected.every(x => v.includes(x))
              ) {
                return;
              }
              setSearchParams((prev) => (Object.fromEntries([
                ...prev.entries(),
                ["tag", v],
              ])));
            }}
            placeHolder={selected.length === 0
              ? "태그로 원하는 펀딩을 찾아보세요!"
              : ""}
          />
        </div>
        <div className={classes["funding_createbtn"]}>
          <NavLink to={"/fundings/post"}>
            <GoArrowRight className={classes["create_svg"]}></GoArrowRight>{" "}
            펀딩 만들기
          </NavLink>
        </div>
      </div>
      <div className={classes["funding_itemarea"]}>
        <FundingList
          tags={selected}
          is_empahsis_tag={(x) => selected.includes(x)}
          title={searchParams.get("title") ?? undefined}
        />
      </div>
    </Container>
  );
};

export default FundingsHome;
