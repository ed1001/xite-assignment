import styles from "./ContentContainer.module.scss";
import { PropsWithChildren } from "react";

const ContentContainer = ({ children }: PropsWithChildren<{}>) => {
  return <main className={styles.content}>{children}</main>;
};

export default ContentContainer;
