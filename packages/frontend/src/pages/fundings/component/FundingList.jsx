import useFundings from "../../../hook/useFundings";
import classes from "./FundingList.module.css";
import FundingItem from "./Item";

export function FundingList({
  title,
  tags,
  is_empahsis_tag,
}) {
  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
  } = useFundings({
    offset: 0,
    limit: 50,
    tags: tags,
    title: title,
  });

  if (fetcherIsLoading) {
    return (
      <div className={classes["no_tagresult"]} key={0}>
        <div>로딩중...</div>
      </div>
    );
  }

  if (fetcherError) {
    return (
      <div className={classes["no_tagresult"]} key={0}>
        <div>에러가 발생했습니다.</div>
      </div>
    );
  }

  return fetcherData.length === 0
    ? (
      <div className={classes["no_tagresult"]} key={0}>
        이런, 검색 결과를 찾을 수 없어요
        <div>
          검색 태그의 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해 보세요.
        </div>
      </div>
    )
    : (
      fetcherData.map((x) => (
        <FundingItem
          style={{ border: "none" }}
          is_empahsis_tag={is_empahsis_tag}
          key={x.id}
          item={x}
        />
      ))
    );
}

export default FundingList;
