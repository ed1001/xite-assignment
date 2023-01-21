import { PropsWithChildren } from "react";
import CSS from "csstype";
import styles from "./ListHeader.module.scss";

const ListHeader = ({
  children,
  style,
}: PropsWithChildren<{ style?: CSS.Properties }>) => {
  return (
    <div style={style} className={styles["list-header"]}>
      {children}
    </div>
  );
};

export default ListHeader;
