import { NavLink, useSearchParams } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import useFundings from "../../hook/useFundings";
import classes from "./FundingsHome.module.css";
import "./progressbar.css";
import "../community/styles/tags.css";

import FundingItem from "./component/Item";
// import FundingsHome_placeholder from "./FundingsHome_placeholder";

const FundingsHome = function() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.getAll("tag");

  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useFundings({
    offset: 0,
    limit: 50,
    tags: selected.length > 0 ? selected : undefined,
  });

  if (fetcherIsLoading) {
    return <div>로딩 중..</div>;
    // <FundingsHome_placeholder/>);
  }

  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <div className={classes["funding_container"]}>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <div className={classes["funding_navarea"]}>
        <div className={classes["funding_tagsearch"]}>
          <TagsInput
            classNames={{
              input: classes["funding_taginput"],
              tag: classes["funding_tag"],
            }}
            value={selected}
            onChange={(v) => {
              setSearchParams({ tag: v });
            }}
            name="fruits"
            placeHolder={selected.length === 0
              ? "태그로 원하는 펀딩을 찾아보세요!"
              : ""}
          />
        </div>

        <div className={classes["funding_createbtn"]}>
          <NavLink to={"/fundings/post"}>
            <p className={classes["go_create"]}>펀딩 만들기</p>
          </NavLink>
        </div>
      </div>
      <div className={classes["funding_itemarea"]}>
        {fetcherData.map((x) => (
          <FundingItem
            style={{ border: "none" }}
            is_empahsis_tag={(t) => selected.includes(t)}
            key={x.id}
            item={x}
          />
        ))}
      </div>
    </div>
  );
};

export default FundingsHome;
