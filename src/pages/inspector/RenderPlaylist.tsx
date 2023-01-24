import { InspectableItem, Playlist } from "../../types";
import {
  useAddToPlaylist,
  useEditPlaylistName,
  usePlaylist,
} from "../../react-query/playlists";
import styles from "./Inspector.module.scss";
import { AddToPlaylist, ListEntry } from "../../components";
import { isEven } from "../../util";
import { TbMoodEmpty } from "react-icons/tb";
import { EmptyItem } from "./RenderEntities";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useScrollToAddedElement } from "../../hooks";
import { FaEdit } from "react-icons/fa";

export const RenderPlaylist = ({ item }: { item: InspectableItem }) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(item.displayName);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { data: playlist } = usePlaylist(item.id);
  const editName = useEditPlaylistName().mutate;

  useEffect(() => {
    if (editingName) {
      nameInputRef?.current?.focus();
    }
  }, [editingName]);

  if (!playlist) {
    return <EmptyItem item={item} />;
  }

  const { tracks } = playlist;

  const handleSubmitEditTitle = (event: any) => {
    event.preventDefault();

    editName({ id: playlist.id, name });
    setEditingName(false);
  };

  return (
    <div className={styles["item-container"]}>
      <div className={styles["item-header-container"]}>
        <h2 className={styles.description}>Playlist Info </h2>
        <div className={styles.name}>
          {editingName ? (
            <form onSubmit={handleSubmitEditTitle}>
              <input
                className={styles["name-input"]}
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={handleSubmitEditTitle}
              />
            </form>
          ) : (
            <h2>{item.displayName}</h2>
          )}
          <div
            className={styles["header-button"]}
            onClick={() => setEditingName(true)}
          >
            <FaEdit />
          </div>
        </div>
      </div>
      {!!tracks.length ? (
        <>
          <h3>Tracks:</h3>
          <PlaylistDropZone
            playlist={playlist}
            className={styles["tracks-container"]}
          >
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
                  addToPlaylist={
                    <AddToPlaylist
                      track={track}
                      addedAt={addedAt}
                      origin={"inspector"}
                    />
                  }
                />
              );
            })}
          </PlaylistDropZone>
        </>
      ) : (
        <PlaylistDropZone playlist={playlist} className={styles.empty}>
          <TbMoodEmpty />
          <p>
            No tracks in this playlist yet
            <br />
            <br /> Add tracks either by dragging a track into a playlist in the
            inspector (the outlined area here) or by clicking the add to
            playlist button on a track
          </p>
        </PlaylistDropZone>
      )}
    </div>
  );
};

const PlaylistDropZone = ({
  playlist,
  className,
  children,
}: PropsWithChildren<{ playlist: Playlist; className: string }>) => {
  const scrollRef = useScrollToAddedElement();
  const addToPlaylist = useAddToPlaylist().mutate;
  const [dropZoneEntered, setDropZoneEntered] = useState(false);
  const checkDroppable = (event: React.DragEvent) => {
    const isDroppable = event.dataTransfer.types.includes("text/plain");
    if (isDroppable) {
      event.preventDefault();
    }

    return isDroppable;
  };

  const onDrop = (e: React.DragEvent) => {
    setDropZoneEntered(false);
    const json = e.dataTransfer.getData("text/plain");
    const { trackId } = JSON.parse(json);
    addToPlaylist({ trackId: +trackId, playlist, openInInspector: true });
  };

  return (
    <div
      ref={scrollRef}
      onDragOver={(event) => {
        if (checkDroppable(event)) {
          setDropZoneEntered(true);
        }
      }}
      onDragEnter={checkDroppable}
      onDragLeave={() => setDropZoneEntered(false)}
      onDrop={onDrop}
      className={classnames(
        styles.dropzone,
        {
          [styles["dropzone-active"]]: dropZoneEntered,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
