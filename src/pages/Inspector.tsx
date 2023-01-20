import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import classnames from "classnames";
import { BsMusicNote, BsMusicNoteList } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { FaGuitar } from "react-icons/fa";
import { TbMoodEmpty } from "react-icons/tb";

import styles from "./Inspector.module.scss";
import {
  rqSetCurrentInspectorItemIndex,
  rqToggleInspecterOpen,
  useCurrentInspectorItemIndex,
  useInspectedItems,
  useInspectorOpen,
  useRemoveFromInspector,
} from "../react-query/inspector";
import { InspectableItem } from "../types";
import { RxCross2 } from "react-icons/rx";
import { useTrack } from "../react-query/tracks";

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
      {open && renderItem(currentInspectorItem)}
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

const renderItem = (item?: InspectableItem) => {
  if (!item) {
    return (
      <div className={styles.empty}>
        <TbMoodEmpty />
        <p>
          Nothing to see here at the moment... <br />
          <br />
          Click 'inspect' on a track, artist or playlist to inspect its details
        </p>
      </div>
    );
  }

  switch (item.type) {
    case "track":
      return <RenderTrack item={item} />;
    case "artist":
      return <RenderArtist item={item} />;
  }
};
const RenderTrack = ({ item }: { item: InspectableItem }) => {
  const { data: track } = useTrack(item.id);

  if (!track) {
    return <p>Something went wrong... Track not found!</p>;
  }

  const {
    title,
    displayArtist,
    artists: artistDataList,
    createdAt,
    updatedAt,
    ...rest
  } = track;
  const artists = artistDataList.map(({ artist }) => artist.name);
  const additionalInfo = {
    artists,
    createdAt: new Date(createdAt).toDateString(),
    updatedAt: new Date(updatedAt).toDateString(),
  };

  return (
    <div className={styles["item-container"]}>
      <h2 className={styles.description}>Track Info </h2>
      <h2>{title}</h2>
      <h3>{displayArtist}</h3>
      <br />
      {Object.entries({ ...additionalInfo, ...rest }).map(([key, value]) => {
        const string = Array.isArray(value) ? value.join(", ") : value;
        return (
          <div>
            <b>{key}</b>: {string || "none"}
          </div>
        );
      })}
    </div>
  );
};
const RenderArtist = ({ item }: { item: InspectableItem }) => {
  return <div>{JSON.stringify(item)}</div>;
};
export default Inspector;
