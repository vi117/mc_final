import classes from "./FundingsHome_placeholder.module.css";
import "./progressbar.css";
import "../community/styles/tags.css";
import { Card } from "react-bootstrap";
// import { TagsInput } from "react-tag-input-component";
// import "./FundingsHome_Item.css"

const placeholderimage = "https://via.placeholder.com/342X273.59";

// const GridContainer = styled("div")({
//   display: "grid",
//   gridTemplateColumns: "repeat(3, 1fr)",
//   gridGap: "20px",
//   justifyContent: "center",
// });

const FundingsHome_placeholder = function() {
  return (
    <div className={classes["funding_container"]}>
      {/* <div style={{border:"red solid 1px", height:"46px"}}></div> */}
      <div className={classes["funding_navarea"]}>
        <div className={classes["funding_tagsearch"]}>
        </div>
        <div className={classes["funding_createbtn"]}>
          <p className={classes["go_create"]}></p>
        </div>
      </div>
      <div className={classes["funding_itemarea"]}>
        <Card>
          {/* <div > */}
          <div className={classes["funding_card"]}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <tr key={index}>
                {/* <Placeholder> */}
                <img
                  src={placeholderimage}
                  className={classes["funding_item_thumbnail"]}
                  class="placeholder"
                  // style={{
                  //   border:"red solid 1px",
                  //   width:"342px",
                  //   height:"273.59px"}}
                >
                </img>
                {/* </Placeholder> */}
                {
                  /* <Placeholder as="td" animation="glow">
                    <Placeholder style={{ width: "50px" }} />
                  </Placeholder>
                  <Placeholder as="td" animation="glow">
                    <Placeholder style={{ width: "100px" }} />
                  </Placeholder>
                  <Placeholder as="td" animation="glow">
                    <Placeholder style={{ width: "50px" }} />
                  </Placeholder> */
                }
              </tr>
            ))}
          </div>

          {/* </div> */}
          {
            /* <div className={classes["funding_card"]} class="placeholder">
            <div
              style={{
                border: "red solid 1px",
                width: "342px",
                height: "273.59px",
              }}
            >
            </div>
          </div>
          <div className={classes["funding_card"]} class="placeholder">
            <div
              style={{
                border: "red solid 1px",
                width: "342px",
                height: "273.59px",
              }}
            >
            </div>
          </div> */
          }
        </Card>
      </div>
    </div>
  );
};

export default FundingsHome_placeholder;
