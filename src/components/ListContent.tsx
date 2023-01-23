import { PropsWithChildren, ReactElement } from "react";
import capitalize from "lodash.capitalize";
import styles from "./ListContent.module.scss";
import { SearchBar } from "./index";
import classnames from "classnames";
import { EntityType } from "../types";

interface Props {
  type: EntityType;
  onSearch: (searchTerm: string) => void;
  listHeaderAttributes: string[];
  searchPlaceholder: string;
  renderHeaderItems?: () => ReactElement;
}

const ListContent = ({
  type,
  onSearch,
  listHeaderAttributes,
  searchPlaceholder,
  renderHeaderItems,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <section className={styles.content}>
      <div className={styles.header}>
        <h1>{`${capitalize(type)}s`}</h1>
        <div className={styles["header-items"]}>
          {renderHeaderItems?.()}
          <SearchBar
            onSearch={onSearch}
            searchPlaceholder={searchPlaceholder}
          />
        </div>
      </div>
      <div className={classnames(styles["list-header"], styles[type])}>
        {listHeaderAttributes.map((listHeaderValue) => (
          <div key={listHeaderValue}>{listHeaderValue}</div>
        ))}
      </div>
      <div className={classnames(styles.list, styles[type])}>{children}</div>
    </section>
  );
};

export default ListContent;
