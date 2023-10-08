import BestArticle from "./components/bestarticle";
import Board from "./components/board";
import classes from "./styles/Community.module.css";

export function Community() {
  return (
    <>
      <BestArticle className={classes["best-wrap"]}></BestArticle>
      <div
        style={{
          backgroundColor: "white",
        }}
      >
        <div className={classes["list-wrap"]}>
          <Board></Board>
        </div>
      </div>
    </>
  );
}

export default Community;
