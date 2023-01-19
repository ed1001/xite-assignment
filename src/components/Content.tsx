import { PropsWithChildren } from "react";

import styles from "./Content.module.scss";
import { SearchBar } from "./index";

interface Props {
  header: string;
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
}

const Content = ({
  children,
  header,
  searchable,
  onSearch,
  placeholder,
}: PropsWithChildren<Props>) => {
  return (
    <section className={styles.content}>
      <div className={styles.header}>
        <h1>{header}</h1>
        {searchable && onSearch && (
          <SearchBar
            onSearch={onSearch}
            placeholder={placeholder || "Search"}
          />
        )}
      </div>
      {children}
    </section>
  );
};

export default Content;
