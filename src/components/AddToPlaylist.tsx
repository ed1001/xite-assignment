import { Playlist, Track } from "../types";
import React, { useState } from "react";
import {
  useAddToPlaylist,
  useCreatePlaylist,
  usePlaylists,
} from "../react-query/playlists";
import styles from "./AddToPlaylist.module.scss";
import {
  useDropdownOpenId,
  useSetDropdownOpenId,
} from "../react-query/dropdown";
import { BsMusicNoteList } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import classnames from "classnames";
import { createPortal } from "react-dom";

const AddToPlaylist = ({
  track,
  origin,
  addedAt,
}: {
  track: Track;
  origin: "inspector" | "list";
  addedAt?: string;
}) => {
  const [dropdownPostion, setDropdownPostion] = useState({ x: 0, y: 0 });
  const [displayUpwards, setDisplayUpwards] = useState(false);
  const { data: dropdownOpenId } = useDropdownOpenId();
  const setDropdownOpenId = useSetDropdownOpenId().mutate;
  const dropdownId = `addToPlaylist:${track.id}:${origin}:${addedAt}`;
  const dropdownOpen = dropdownOpenId === dropdownId;

  const { data: playlists } = usePlaylists();
  const createPlaylist = useCreatePlaylist().mutate;
  const addToPlaylist = useAddToPlaylist().mutate;

  const handleWindowClick = (event: MouseEvent) => {
    const classList = (event.target as Element).classList;
    if (classList.contains(styles["dropdown-item"])) {
      return;
    }

    setDropdownOpenId("");
  };

  const handleClickOpenDropdown = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    setDisplayUpwards(event.clientY > window.innerHeight / 2);

    if (!dropdownOpen) {
      window.addEventListener("click", handleWindowClick, { once: true });
      setDropdownPostion({ x: event.clientX, y: event.clientY });
      return setDropdownOpenId(dropdownId);
    }

    window.removeEventListener("click", handleWindowClick);
    setDropdownOpenId("");
  };

  const handleClickCreatePlaylist = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    createPlaylist({ track, openInInspector: true });
    setDropdownOpenId("");
    event.stopPropagation();
  };

  const handleClickAddToPlaylist = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    playlist: Playlist
  ) => {
    addToPlaylist({ trackId: track.id, playlist, openInInspector: true });
    setDropdownOpenId("");
    event.stopPropagation();
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleClickOpenDropdown}>
        <BsMusicNoteList />
        <GoPlus className={styles.plus} />
      </button>
      {dropdownOpen &&
        createPortal(
          <div
            style={{ top: dropdownPostion.y, left: dropdownPostion.x - 200 }}
            className={classnames(styles.dropdown, {
              [styles.upwards]: displayUpwards,
            })}
          >
            <div
              className={classnames(styles["dropdown-item"], {
                [styles.bordered]: playlists?.length,
              })}
              onClick={handleClickCreatePlaylist}
            >
              Create playlist &nbsp; <GoPlus />
            </div>
            {playlists?.map((playlist) => {
              return (
                <div
                  key={playlist.id}
                  className={styles["dropdown-item"]}
                  onClick={(event) => handleClickAddToPlaylist(event, playlist)}
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
