import BestArticle from "./components/bestarticle";
import Board from "./components/board";
import classes from "./styles/Community.module.css";

export function Community() {
  return (
    <>
      <BestArticle></BestArticle>
      <div className={classes["list-wrap"]}>
        <Board></Board>
      </div>
    </>
  );
}

export default Community;
