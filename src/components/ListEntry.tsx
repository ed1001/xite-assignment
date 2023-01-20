import classnames from "classnames";
import { PropsWithChildren } from "react";
import CSS from "csstype";
import styles from "./ListEntry.module.scss";

const ListEntry = ({
  dark,
  children,
  style,
}: PropsWithChildren<{ dark: boolean; style?: CSS.Properties }>) => {
  return (
    <div
      style={style}
      className={classnames(styles["list-entry"], { [styles.dark]: dark })}
    >
      {children}
    </div>
  );
};

export default ListEntry;
