import classNames from "classnames";
import { FunctionComponent } from "react";

export const Section: FunctionComponent<{ className?: string }> = ({ className, children }) => {
  const classes = classNames("left-0 right-0 py-8 bg-black shadow-lg", className);
  return <section className={classes}>{children}</section>;
};