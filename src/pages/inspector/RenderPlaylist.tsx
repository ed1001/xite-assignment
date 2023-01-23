import { InspectableItem } from "../../types";
import { usePlaylist } from "../../react-query/playlists";
import styles from "./Inspector.module.scss";
import { ListEntry } from "../../components";
import { isEven } from "../../util";
import { TbMoodEmpty } from "react-icons/tb";
import { EmptyItem } from "./RenderEntities";

export const RenderPlaylist = ({ item }: { item: InspectableItem }) => {
  const { data: playlist } = usePlaylist(item.id);

  if (!playlist) {
    return <EmptyItem item={item} />;
  }

  const { tracks } = playlist;

  return (
    <div className={styles["item-container"]}>
      <div className={styles["item-header-container"]}>
        <h2 className={styles.description}>Playlist Info </h2>
        <h2>{item.displayName}</h2>
      </div>
      <br />
      {!!tracks.length ? (
        <>
          <h3 style={{ marginBottom: "10px" }}>Tracks:</h3>
          <div className={styles["tracks-container"]}>
            {tracks.map(({ track, addedAt }, i) => {
              return (
                <ListEntry
                  key={`${track.id}:${addedAt}`}
                  listEntryData={[track.title]}
                  dark={isEven(i)}
                  type={"track-abbreviated"}
                  inspectableItem={{
                    type: "track",
                    id: track.id,
                    displayName: track.title,
                  }}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <TbMoodEmpty />
          <p>
            No tracks in this playlist yet
            <br />
            <br /> Add tracks either by dragging a track into a playlist in the
            inspector (the outlined area here) or by clicking the add to
            playlist button on a track
          </p>
        </div>
      )}
    </div>
  );
};
