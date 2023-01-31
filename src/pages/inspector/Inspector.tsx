import React from "react";
import classnames from "classnames";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { BsMusicNote, BsMusicNoteList } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { FaGuitar } from "react-icons/fa";
import { TbMoodEmpty } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import styles from "./Inspector.module.scss";
import {
  useCurrentInspectorItemIndex,
  useInspectedItems,
  useInspectorOpen,
  useRemoveFromInspector,
  useSetCurrentInspectorItemIndex,
  useToggleInspectorOpen,
} from "../../react-query/inspector";
import { useScrollToAddedOrActiveElement } from "../../hooks";
import { ErrorBoundaryWrapped } from "../../components";
import { RenderPlaylist } from "./RenderPlaylist";
import { RenderArtist, RenderGenre, RenderTrack } from "./RenderEntities";
import { InspectableItem } from "../../types";

const Inspector = () => {
  const { data: open } = useInspectorOpen();
  const { data: inspectedItems } = useInspectedItems();
  const { data: currentInspectorItemIndex = -1 } =
    useCurrentInspectorItemIndex();
  const toggleInspectorOpen = useToggleInspectorOpen().mutate;

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
          onClick={() => toggleInspectorOpen()}
          className={styles["toggle-open"]}
        >
          {open ? <TfiArrowCircleRight /> : <TfiArrowCircleLeft />}
        </button>
      </div>
      {!open && <h1 className={styles["vertical-header"]}>Inspector</h1>}
      {open && inspectedItems && (
        <>
          <RenderTabs
            items={inspectedItems}
            activeIndex={currentInspectorItemIndex}
          />
          {renderItem(currentInspectorItem)}
        </>
      )}
    </section>
  );
};

const RenderTabs = ({
  items,
  activeIndex,
}: {
  items?: InspectableItem[];
  activeIndex: number;
}) => {
  const removeFromInspector = useRemoveFromInspector().mutate;
  const setCurrentInspectorItemIndex = useSetCurrentInspectorItemIndex().mutate;
  const scrollRef = useScrollToAddedOrActiveElement();

  return (
    <div ref={scrollRef} className={styles.tabs}>
      {items?.map((item, i) => {
        const Icon = {
          track: BsMusicNote,
          artist: SlPeople,
          playlist: BsMusicNoteList,
          genre: FaGuitar,
        }[item.type];

        return (
          <div
            key={JSON.stringify(item)}
            className={classnames(styles.tab, {
              [styles.active]: i === activeIndex,
            })}
            onClick={() => setCurrentInspectorItemIndex(i)}
          >
            <Icon className={styles.icon} />
            <div className={styles.identifier}>{item.displayName}</div>
            <div className={styles.cross}>
              <RxCross2
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromInspector({ id: item.id, type: item.type });
                }}
              />
            </div>
          </div>
        );
      })}
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
          Click on a track, artist, genre or playlist to view its details
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

export default ErrorBoundaryWrapped(Inspector);
