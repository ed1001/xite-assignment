import classnames from "classnames";
import styles from "./ListEntry.module.scss";
import { InspectableItem, Listable } from "../types";
import { useAddToInspector } from "../react-query/inspector";
import { ReactElement } from "react";

const ListEntry = ({
  listEntryData,
  dark,
  type,
  inspectableItem,
}: {
  listEntryData: Array<string | number | ReactElement>;
  dark: boolean;
  type: Listable;
  inspectableItem?: InspectableItem;
}) => {
  const addToInspector = useAddToInspector().mutate;
  const handleClick = () => {
    if (!inspectableItem) {
      return;
    }

    addToInspector(inspectableItem);
  };

  return (
    <div
      onClick={handleClick}
      className={classnames(styles["list-entry"], styles[type], {
        [styles.dark]: dark,
      })}
    >
      {listEntryData.map((attribute, i) => (
        <div key={`${attribute}:${i}`}>{attribute}</div>
      ))}
    </div>
  );
};

export default ListEntry;
