import { GoInfo } from "react-icons/go";
import classes from "./Guide.module.css";

export function Guide({
  children,
  title,
}) {
  return (
    <ul className={classes.guide}>
      <li className={classes.guide_bold}>
        <GoInfo className={classes.guide_svg}></GoInfo>
        {title}
      </li>
      {children}
    </ul>
  );
}

export default Guide;
