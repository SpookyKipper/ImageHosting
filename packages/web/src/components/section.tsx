import classNames from "classnames";
import { FC, ReactNode } from "react";

export const Section: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => {
  const classes = classNames("left-0 right-0 py-8 bg-black shadow-lg", className);
  return <section className={classes}>{children}</section>;
};
