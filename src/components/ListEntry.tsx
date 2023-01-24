import { ReactElement } from "react";
import classnames from "classnames";
import styles from "./ListEntry.module.scss";
import { useAddToInspector } from "../react-query/inspector";
import { InspectableItem, Listable } from "../types";

const ListEntry = ({
  listEntryData,
  dark,
  type,
  inspectableItem,
  addToPlaylist,
  draggableProps,
}: {
  listEntryData: Array<string | number | ReactElement>;
  dark: boolean;
  type: Listable;
  inspectableItem?: InspectableItem;
  addToPlaylist?: ReactElement;
  draggableProps?: any;
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
      {...draggableProps}
      onClick={handleClick}
      className={classnames(styles["list-entry"], styles[type], {
        [styles.dark]: dark,
      })}
    >
      {listEntryData.map((attribute, i) => (
        <div key={`${attribute}:${i}`}>
          {["string", "number"].includes(typeof attribute) ? (
            <p>{attribute}</p>
          ) : (
            attribute
          )}
        </div>
      ))}
      {addToPlaylist}
    </div>
  );
};

export default ListEntry;
