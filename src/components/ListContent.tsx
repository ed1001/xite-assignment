import { PropsWithChildren, ReactElement } from "react";
import capitalize from "lodash.capitalize";
import styles from "./ListContent.module.scss";
import { Loading, LoadMoreButton, SearchBar } from "./index";
import classnames from "classnames";
import { EntityType } from "../types";

interface Props {
  type: EntityType;
  onSearch: (searchTerm: string) => void;
  listHeaderAttributes: string[];
  searchPlaceholder: string;
  renderHeaderItems?: () => ReactElement;
  isLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  totalCount?: number;
  shownCount?: number;
}

const ListContent = ({
  type,
  onSearch,
  listHeaderAttributes,
  searchPlaceholder,
  renderHeaderItems,
  isLoading,
  fetchNextPage,
  hasNextPage,
  totalCount,
  shownCount,
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
      <div className={classnames(styles.list, styles[type])}>
        {isLoading ? <Loading /> : children}
      </div>
      <div className={styles.footer}>
        <div className={styles.info}>
          Showing {shownCount} out of {totalCount} results
        </div>
        <LoadMoreButton
          disabled={!hasNextPage}
          onClick={() => fetchNextPage?.()}
        >
          load more {type}s
        </LoadMoreButton>
      </div>
    </section>
  );
};

export default ListContent;
