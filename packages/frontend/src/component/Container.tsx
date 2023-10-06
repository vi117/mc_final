import clsx from "clsx";
import classes from "./Container.module.css";

export function Container(
  { children, className, as: Elem = "div", style }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    as: React.ElementType;
  },
) {
  return (
    <Elem className={clsx(classes.container, className)} style={style}>
      {children}
    </Elem>
  );
}
export default Container;
