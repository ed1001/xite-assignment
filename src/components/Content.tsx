import { PropsWithChildren } from "react";

import styles from "./Content.module.scss";

interface Props {
  header: string;
  searchable?: boolean;
}

const Content = ({
  children,
  header,
  searchable,
}: PropsWithChildren<Props>) => {
  return (
    <section className={styles.content}>
      <div className={styles.header}>
        <h1>{header}</h1>
      </div>
      {children}
    </section>
  );
};

export default Content;
