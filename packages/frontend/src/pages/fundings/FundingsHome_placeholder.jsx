import classes from "./FundingsHome.module.css";
import "./progressbar.css";
import "../community/styles/tags.css";
// import "./FundingsHome_Item.css"

// const placerholder = "https://via.placeholder.com/100x100";

// const GridContainer = styled("div")({
//   display: "grid",
//   gridTemplateColumns: "repeat(3, 1fr)",
//   gridGap: "20px",
//   justifyContent: "center",
// });

const FundingsHome_placeholder = function() {
  return (
    <>
      <div className={classes["funding_container"]}>
        {
          /* <div class="placeholder" className={classes["funding_navarea"]}>
        <div class="placeholder" className={classes["funding_tagsearch"]}>
          mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
        </div>

        <div className={classes["funding_createbtn"]}>
            <p class="placeholder">펀딩 만들기</p>
        </div>
      </div>
      <div class="placeholder col-4" className={classes["funding_itemarea"]}>
      </div> */
        }
      </div>

      <div class="placeholder col-4" className={classes["funding_card"]}>
        <img class="placeholder" />
        <div>
          <div
            class="placeholder col-4"
            className={classes["funding_tags_area"]}
          >
            <ul
              class="placeholder col-4"
              className={classes["funding_item_tags"]}
            >
              <li>tag</li>
              <li>tag</li>
            </ul>
          </div>
          <div
            class="placeholder col-4"
            className={classes["funding_item_title"]}
          >
            title
          </div>
          <div
            class="placeholder col-4"
            className={classes["funding_progress_percantage"]}
          >
            100%달성!
            <span>000000원</span>
            <span className={classes["progress_resttime"]}>
              000000일 남음
            </span>
          </div>
          <div class="placeholder col-4">
          </div>
        </div>
      </div>
    </>
  );
};

export default FundingsHome_placeholder;
