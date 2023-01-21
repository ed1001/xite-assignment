import { PropsWithChildren, ReactElement } from "react";

import styles from "./Content.module.scss";
import { SearchBar } from "./index";

interface Props {
  header: string;
  preMainRender?: () => ReactElement;
  searchProps?: {
    searchable: boolean;
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
  };
}

const Content = ({
  children,
  header,
  searchProps,
  preMainRender,
}: PropsWithChildren<Props>) => {
  return (
    <section className={styles.content}>
      <div className={styles.header}>
        <h1>{header}</h1>
        {searchProps && (
          <SearchBar
            onSearch={searchProps.onSearch}
            placeholder={searchProps.placeholder}
          />
        )}
      </div>
      {preMainRender?.()}
      <div className={styles.main}>{children}</div>
    </section>
  );
};

export default Content;
