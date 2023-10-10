import Profileimg from "../community/assets/user.png";
import FundingItem from "../fundings/component/Item";
import classes from "./hostProfileview.module.css";
// import { useState } from "react";
import { useParams } from "react-router-dom";
import useFundings from "../../hook/useFundings";
import useUserInfo from "../../hook/useUser";
// import { useLoginInfo } from "../../hook/useLogin";
// import { UserObject } from "../";

const HostProfile = function() {
  const { id } = useParams();
  const { data: user, error, isLoading: isUserLoading } = useUserInfo(id);
  // const user1 = UserObject();
  // const userInfo = useLoginInfo();
  // const [selected, setSelected] = useState([]);
  const {
    data: fundings,
    error: fetcherError,
    isLoading: IsFundingsLoading,
  } = useFundings({
    offset: 0,
    limit: 50,
    host_id: id,
    // tags: selected.length > 0 ? selected : undefined,
  });

  if (IsFundingsLoading || isUserLoading) {
    return <div>로딩 중..</div>;
  }

  if (fetcherError || error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      <div className={classes["funding_container"]}>
        <div className={classes["user_profile"]}>
          <img
            src={user.profile_image ?? Profileimg}
            className={classes["user_profile_img"]}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className={classes["host_nickname"]}>
              {user.nickname}
            </span>
            <span>{user.introduction}</span>
          </div>
        </div>

        <div
          style={{ fontSize: "24px", fontWeight: "700" }}
          className={classes["title"]}
        >
          펀딩 리스트
        </div>
        <div className={classes["funding_itemarea"]}>
          {fundings.map((x) => (
            <FundingItem
              style={{ border: "none" }}
              key={x.id}
              item={x}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HostProfile;
