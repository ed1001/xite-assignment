import { PropsWithChildren } from "react";
import capitalize from "lodash.capitalize";
import styles from "./ListContent.module.scss";
import { SearchBar } from "./index";
import classnames from "classnames";
import { EntityList } from "../types";

interface Props {
  type: EntityList;
  onSearch: (searchTerm: string) => void;
  listHeaderAttributes: string[];
  searchPlaceholder: string;
}

const ListContent = ({
  type,
  onSearch,
  listHeaderAttributes,
  searchPlaceholder,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <section className={styles.content}>
      <div className={styles.header}>
        <h1>{`${capitalize(type)}s`}</h1>
        <SearchBar onSearch={onSearch} searchPlaceholder={searchPlaceholder} />
      </div>
      <div className={classnames(styles["list-header"], styles[type])}>
        {listHeaderAttributes.map((listHeaderValue) => (
          <div>{listHeaderValue}</div>
        ))}
      </div>
      <div className={classnames(styles.list, styles[type])}>{children}</div>
    </section>
  );
};

export default ListContent;
