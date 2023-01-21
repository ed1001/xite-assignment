import classnames from "classnames";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { BsMusicNote, BsMusicNoteList } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { FaGuitar } from "react-icons/fa";
import { TbMoodEmpty, TbMoodSad } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

import styles from "./Inspector.module.scss";
import {
  rqSetCurrentInspectorItemIndex,
  rqToggleInspecterOpen,
  useAddToInspector,
  useCurrentInspectorItemIndex,
  useInspectedItems,
  useInspectorOpen,
  useRemoveFromInspector,
} from "../react-query/inspector";
import { InspectableItem } from "../types";
import { useTrack, useTracksByArtist } from "../react-query/tracks";
import { useArtist } from "../react-query/artists";
import { InspectButton, ListEntry } from "../components";

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
      {item.id}
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
  }
};
const RenderTrack = ({ item }: { item: InspectableItem }) => {
  const { data: track } = useTrack(item.id);

  if (!track) {
    return (
      <div className={styles.empty}>
        <TbMoodSad />
        <p>
          Something went wrong... Track not found! <br />
          <br /> Try closing this tab and reopening
        </p>
      </div>
    );
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
    createdAt: new Date(createdAt).toLocaleDateString(),
    updatedAt: new Date(updatedAt).toLocaleDateString(),
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
          <div key={key}>
            <b>{key}</b>: {string || "none"}
          </div>
        );
      })}
    </div>
  );
};
const RenderArtist = ({ item }: { item: InspectableItem }) => {
  const { data: artist } = useArtist(item.id);
  const { data: tracks } = useTracksByArtist(item.id);
  const latestTracks = tracks?.slice(0, 10);
  const addToInspector = useAddToInspector().mutate;

  if (!artist) {
    return (
      <div className={styles.empty}>
        <TbMoodSad />
        <p>
          Something went wrong... Artist not found! <br />
          <br /> Try closing this tab and reopening
        </p>
      </div>
    );
  }

  return (
    <div className={styles["item-container"]}>
      <h2 className={styles.description}>Artist Info </h2>
      <h2>{artist.name}</h2>
      <br />
      {latestTracks && (
        <>
          <h3 style={{ marginBottom: "10px" }}>Latest tracks: </h3>
          {latestTracks.map((track, i) => {
            return (
              <ListEntry
                key={track.id}
                dark={i % 2 === 0}
                style={{
                  gridTemplateColumns: "50px 1fr 100px",
                }}
              >
                <div>{i + 1}</div>
                <div className={styles.title}>
                  <div>{track.title}</div>
                  <div className={styles.artist}>{track.displayArtist}</div>
                </div>
                <InspectButton
                  onClick={() =>
                    addToInspector({ type: "track", id: track.id })
                  }
                />
              </ListEntry>
            );
          })}
        </>
      )}
    </div>
  );
};
export default Inspector;
