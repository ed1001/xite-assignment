import classnames from "classnames";
import styles from "./ListEntry.module.scss";
import { InspectableItem, Listable } from "../types";
import { InspectButton } from "./index";
import { useAddToInspector } from "../react-query/inspector";

const ListEntry = ({
  listEntryData,
  dark,
  type,
  inspectableItem,
}: {
  listEntryData: Array<string | number>;
  dark: boolean;
  type: Listable;
  inspectableItem?: InspectableItem;
}) => {
  const addToInspector = useAddToInspector().mutate;

  return (
    <div
      className={classnames(styles["list-entry"], styles[type], {
        [styles.dark]: dark,
      })}
    >
      {listEntryData.map((attribute) => (
        <div>{attribute}</div>
      ))}
      {inspectableItem && (
        <InspectButton onClick={() => addToInspector(inspectableItem)} />
      )}
    </div>
  );
};

export default ListEntry;
