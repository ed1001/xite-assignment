import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { TbMoodEmpty } from "react-icons/tb";
import { isEven } from "../../util";
import {
  useAddToPlaylist,
  useEditPlaylistName,
  usePlaylist,
  useRemovePlaylist,
} from "../../react-query/playlists";
import styles from "./Inspector.module.scss";
import { useScrollToAddedOrActiveElement } from "../../hooks";
import { AddToPlaylist, ListEntry } from "../../components";
import { EmptyItem } from "./RenderEntities";
import { InspectableItem, Playlist } from "../../types";

export const RenderPlaylist = ({ item }: { item: InspectableItem }) => {
  const [editingName, setEditingName] = useState<boolean>(false);
  const [name, setName] = useState<string>(item.displayName);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { data: playlist } = usePlaylist(item.id);

  const editName = useEditPlaylistName().mutate;
  const removePlaylist = useRemovePlaylist().mutate;

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

    if (name.length) {
      editName({ id: playlist.id, name });
    } else {
      setName(item.displayName);
    }

    setEditingName(false);
  };

  return (
    <div className={styles["item-container"]}>
      <div className={styles["item-header-container"]}>
        <div>
          <h2 className={styles.description}>Playlist Info</h2>
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
        <div>
          <div
            className={styles["header-button"]}
            onClick={() => removePlaylist(playlist)}
          >
            <FaTrashAlt />
          </div>
        </div>
      </div>
      {!!tracks.length ? (
        <>
          <h3>Tracks:</h3>
          <DropZone playlist={playlist} className={styles["tracks-container"]}>
            {tracks.map(({ track, addedAt }, i) => {
              return (
                <ListEntry
                  key={`${track.id}:${addedAt}`}
                  listEntryData={[i + 1, track.title]}
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
          </DropZone>
        </>
      ) : (
        <DropZone playlist={playlist} className={styles.empty}>
          <TbMoodEmpty />
          <p>
            No tracks in this playlist yet
            <br />
            <br /> Add tracks either by dragging a track into a playlist in the
            inspector (the outlined area here) or by clicking the add to
            playlist button on a track
          </p>
        </DropZone>
      )}
    </div>
  );
};

const DropZone = ({
  playlist,
  className,
  children,
}: PropsWithChildren<{ playlist: Playlist; className: string }>) => {
  const [dropZoneEntered, setDropZoneEntered] = useState<boolean>(false);
  const [droppableDragged, setDroppableDragged] = useState<boolean>(false);
  const scrollRef = useScrollToAddedOrActiveElement();
  const addToPlaylist = useAddToPlaylist().mutate;

  useEffect(() => {
    const onDocumentDragStart = (event: DragEvent) =>
      setDroppableDragged(checkDroppable(event));

    const onDocumentDragEnd = () => setDroppableDragged(false);

    document.addEventListener("dragstart", onDocumentDragStart);
    document.addEventListener("dragend", onDocumentDragEnd);

    return () => {
      document.removeEventListener("dragstart", onDocumentDragStart);
      document.removeEventListener("dragend", onDocumentDragEnd);
    };
  }, []);

  const checkDroppable = (event: React.DragEvent | DragEvent) =>
    !!event?.dataTransfer?.types.includes("text/plain");

  const onDrop = (e: React.DragEvent) => {
    setDropZoneEntered(false);
    const json = e.dataTransfer.getData("text/plain");
    const { trackId } = JSON.parse(json);
    addToPlaylist({
      trackId: +trackId,
      playlistId: playlist.id,
      openInInspector: true,
    });
  };

  return (
    <div
      ref={scrollRef}
      onDragOver={(event) => {
        if (checkDroppable(event)) {
          event.preventDefault();
          setDropZoneEntered(true);
        }
      }}
      onDragEnter={(event) => {
        if (checkDroppable(event)) {
          event.preventDefault();
        }
      }}
      onDragLeave={() => setDropZoneEntered(false)}
      onDrop={onDrop}
      className={classnames(
        styles.dropzone,
        {
          [styles["dropzone-active"]]: dropZoneEntered,
          [styles["dropzone-open"]]: droppableDragged,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
