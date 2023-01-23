import classnames from "classnames";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { BsMusicNote, BsMusicNoteList } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { FaGuitar } from "react-icons/fa";
import { TbMoodEmpty } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import styles from "./Inspector.module.scss";
import {
  rqSetCurrentInspectorItemIndex,
  rqToggleInspecterOpen,
  useCurrentInspectorItemIndex,
  useInspectedItems,
  useInspectorOpen,
  useRemoveFromInspector,
} from "../../react-query/inspector";
import { InspectableItem } from "../../types";
import { RenderArtist, RenderGenre, RenderTrack } from "./RenderEntities";
import React from "react";
import { RenderPlaylist } from "./RenderPlayllist";

const typeIconMap = {
  track: BsMusicNote,
  artist: SlPeople,
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
      <Icon className={styles.icon} />
      <div className={styles.identifier}>{item.displayName}</div>
      <div className={styles.cross}>
        <RxCross2
          onClick={(e) => {
            e.stopPropagation();
            removeFromInspector(item);
          }}
        />
      </div>
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
          Click 'inspect' on a track, artist or playlist to view its details
        </p>
      </div>
    );
  }

  switch (item.type) {
    case "track":
      return <RenderTrack item={item} />;
    case "artist":
      return <RenderArtist item={item} />;
    case "playlist":
      return <RenderPlaylist item={item} />;
    case "genre":
      return <RenderGenre item={item} />;
  }
};

export default Inspector;
