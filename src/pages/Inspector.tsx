import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import classnames from "classnames";
import { BsMusicNote, BsMusicNoteList } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { FaGuitar } from "react-icons/fa";

import styles from "./Inspector.module.scss";
import {
  rqToggleInspecterOpen,
  useInspectedItems,
  useCurrentInspectorItemIndex,
  useInspectorOpen,
  useRemoveFromInspector,
  rqSetCurrentInspectorItemIndex,
} from "../react-query/inspector";
import { InspectableItem } from "../types";
import { RxCross2 } from "react-icons/rx";

const typeIconMap = {
  track: BsMusicNote,
  artist: IoIosPeople,
  playlist: BsMusicNoteList,
  genre: FaGuitar,
};

const Inspector = () => {
  const { data: open } = useInspectorOpen();
  const { data: inspectedItems } = useInspectedItems();
  const { data: currentInspectorItemIndex = -1 } =
    useCurrentInspectorItemIndex();
  const removeFromInspector = useRemoveFromInspector().mutate;
  const currentInspectorItem = inspectedItems?.[currentInspectorItemIndex];

  console.log(currentInspectorItemIndex);

  return (
    <section
      className={classnames(styles.content, {
        [styles.closed]: !open,
      })}
    >
      <div className={styles.header}>
        {open && <h1>Inspector</h1>}
        <button
          onClick={() => rqToggleInspecterOpen()}
          className={styles["toggle-open"]}
        >
          {open ? <TfiArrowCircleRight /> : <TfiArrowCircleLeft />}
        </button>
      </div>
      {!open && <h1 className={styles["vertical-header"]}>Inspector</h1>}
      {open && (
        <div className={styles.tabs}>
          {inspectedItems?.map((item, i) => {
            return (
              <RenderTab
                key={JSON.stringify(item)}
                active={i === currentInspectorItemIndex}
                setActive={() => rqSetCurrentInspectorItemIndex(i)}
                item={item}
                removeFromInspector={removeFromInspector}
              />
            );
          })}
        </div>
      )}
      {open && currentInspectorItem && renderItem(currentInspectorItem)}
    </section>
  );
};

const RenderTab = ({
  active,
  setActive,
  item,
  removeFromInspector,
}: {
  active: boolean;
  setActive: () => void;
  item: InspectableItem;
  removeFromInspector: (item: InspectableItem) => void;
}) => {
  const Icon = typeIconMap[item.type];

  return (
    <div
      className={classnames(styles.tab, { [styles.active]: active })}
      onClick={setActive}
    >
      <Icon />
      {item.id}
      <RxCross2
        onClick={(e) => {
          e.stopPropagation();
          removeFromInspector(item);
        }}
      />
    </div>
  );
};

const renderItem = (item: InspectableItem) => {
  switch (item.type) {
    case "track":
      return <RenderTrack item={item} />;
    // case "artist":
    //   return <Track item={item}/>
  }
};
const RenderTrack = ({ item }: { item: InspectableItem }) => {
  return <div>{JSON.stringify(item)}</div>;
};
export default Inspector;
