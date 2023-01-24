import { Playlist, Track } from "../types";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import classnames from "classnames";
import { BsMusicNoteList } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import styles from "./AddToPlaylist.module.scss";
import {
  useAddToPlaylist,
  useCreatePlaylist,
  usePlaylists,
} from "../react-query/playlists";
import {
  useDropdownOpenId,
  useSetDropdownOpenId,
} from "../react-query/dropdown";

const AddToPlaylist = ({
  track,
  origin,
  addedAt,
}: {
  track: Track;
  origin: "inspector" | "list";
  addedAt?: string;
}) => {
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [displayDropdownVertically, setDisplayDropdownVertically] =
    useState(false);

  const { data: dropdownOpenId } = useDropdownOpenId();
  const { data: playlists } = usePlaylists();

  const setDropdownOpenId = useSetDropdownOpenId().mutate;
  const createPlaylist = useCreatePlaylist().mutate;
  const addToPlaylist = useAddToPlaylist().mutate;

  const dropdownId = `addToPlaylist:${track.id}:${origin}:${addedAt}`;
  const dropdownOpen = dropdownOpenId === dropdownId;

  const onWindowClick = (event: MouseEvent) => {
    const classList = (event.target as Element).classList;
    if (classList.contains(styles["dropdown-item"])) {
      return;
    }

    setDropdownOpenId("");
  };

  const onClickOpenDropdown = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    setDisplayDropdownVertically(event.clientY > window.innerHeight / 2);

    if (!dropdownOpen) {
      window.addEventListener("click", onWindowClick, { once: true });
      setDropdownPosition({ x: event.clientX, y: event.clientY });
      return setDropdownOpenId(dropdownId);
    }

    window.removeEventListener("click", onWindowClick);
    setDropdownOpenId("");
  };

  const onClickCreatePlaylist = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    createPlaylist({ trackId: track.id, openInInspector: true });
    setDropdownOpenId("");
    event.stopPropagation();
  };

  const onClickAddToPlaylist = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    playlist: Playlist
  ) => {
    addToPlaylist({
      trackId: track.id,
      playlistId: playlist.id,
      openInInspector: true,
    });
    setDropdownOpenId("");
    event.stopPropagation();
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onClickOpenDropdown}>
        <BsMusicNoteList />
        <GoPlus className={styles.plus} />
      </button>
      {dropdownOpen &&
        createPortal(
          <div
            style={{ top: dropdownPosition.y, left: dropdownPosition.x - 200 }}
            className={classnames(styles.dropdown, {
              [styles.upwards]: displayDropdownVertically,
            })}
          >
            <div
              className={classnames(styles["dropdown-item"], {
                [styles.bordered]: playlists?.length,
              })}
              onClick={onClickCreatePlaylist}
            >
              Create playlist &nbsp; <GoPlus />
            </div>
            {playlists?.map((playlist) => {
              return (
                <div
                  key={playlist.id}
                  className={styles["dropdown-item"]}
                  onClick={(event) => onClickAddToPlaylist(event, playlist)}
                >
                  {playlist.name}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};

export default AddToPlaylist;
