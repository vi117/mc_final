import Profileimg from "../community/assets/user.png";
import FundingItem from "../fundings/component/Item";
import classes from "./hostProfileview.module.css";
// import { useState } from "react";
import { useParams } from "react-router-dom";
import useFundingDetail from "../../hook/useFundingDetail";
import useFundings from "../../hook/useFundings";
// import { useLoginInfo } from "../../hook/useLogin";
// import { UserObject } from "../";

const HostProfile = function() {
  const { id } = useParams();
  const { data: funding, error, isLoading } = useFundingDetail(id);
  // const user1 = UserObject();
  // const userInfo = useLoginInfo();
  // const [selected, setSelected] = useState([]);
  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useFundings({
    offset: 0,
    limit: 50,
    // tags: selected.length > 0 ? selected : undefined,
  });

  if (fetcherIsLoading ?? isLoading) {
    return <div>로딩 중..</div>;
  }

  if (fetcherError ?? error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      <div className={classes["funding_container"]}>
        <div style={{ display: "flex" }}>
          <img
            src={funding.host_profile_image ?? Profileimg}
            className={classes["user"]}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className={classes["host_nickname"]}>
              {funding.host_nickname}
            </span>
            <span>{funding.host_introduction}</span>
          </div>
        </div>
        <div
          style={{ fontSize: "24px", fontWeight: "700" }}
          className={classes["title"]}
        >
          펀딩 리스트
        </div>
        <div className={classes["funding_itemarea"]}>
          {fetcherData.map((x) => (
            <FundingItem
              style={{ border: "none" }}
              key={x.id}
              item={x}
            />
          ))}
        </div>
        <hr />
      </div>
    </>
  );
};

export default HostProfile;
