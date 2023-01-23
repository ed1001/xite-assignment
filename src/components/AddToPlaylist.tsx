import { Playlist, Track } from "../types";
import React from "react";
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

const AddToPlaylist = ({ track }: { track: Track }) => {
  const { data: dropdownOpenId } = useDropdownOpenId();
  const setDropdownOpenId = useSetDropdownOpenId().mutate;
  const dropdownId = `addToPlaylist:${track.id}`;
  const dropdownOpen = dropdownOpenId === dropdownId;

  const { data: playlists } = usePlaylists();
  const createPlaylist = useCreatePlaylist().mutate;
  const addToPlaylist = useAddToPlaylist().mutate;

  const handleWindowClick = (e: MouseEvent) => {
    const classList = (e.target as Element).classList;
    if (classList.contains(styles["dropdown-item"])) {
      return;
    }

    setDropdownOpenId("");
  };

  const handleClickOpenDropdown = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!dropdownOpen) {
      window.addEventListener("click", handleWindowClick, { once: true });
      return setDropdownOpenId(dropdownId);
    }

    window.removeEventListener("click", handleWindowClick);
    setDropdownOpenId("");
  };

  const handleClickCreatePlaylist = () => {
    createPlaylist({ track, openInInspector: true });
    setDropdownOpenId("");
  };

  const handleClickAddToPlaylist = (playlist: Playlist) => {
    addToPlaylist({ track, playlist });
    setDropdownOpenId("");
  };

  return (
    <div className={styles.container}>
      <button onClick={handleClickOpenDropdown}>add to playlist</button>
      {dropdownOpen && (
        <div className={styles.dropdown}>
          <div
            className={styles["dropdown-item"]}
            onClick={handleClickCreatePlaylist}
          >
            Create playlist
          </div>
          {playlists?.map((playlist) => {
            return (
              <div
                className={styles["dropdown-item"]}
                onClick={() => handleClickAddToPlaylist(playlist)}
              >
                {playlist.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddToPlaylist;
