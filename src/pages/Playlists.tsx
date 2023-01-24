import {
  EmptyList,
  ErrorBoundaryWrapped,
  ListContent,
  ListEntry,
} from "../components";
import {
  rq_playlists_keys,
  useCreatePlaylist,
  useInfinitePlaylists,
  usePlaylistTotal,
} from "../react-query/playlists";
import { trimPreviousInfiniteQuery } from "../react-query/util";
import React, { useState } from "react";
import { isEven } from "../util";
import styles from "./Playlists.module.scss";
import { GoPlus } from "react-icons/go";

const Playlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfinitePlaylists(searchTerm);
  const playlists = data?.pages.flatMap((page) => page.playlists);
  const createPlaylist = useCreatePlaylist().mutate;
  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_playlists_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };
  const { data: totalCount } = usePlaylistTotal(searchTerm);
  const shownCount = playlists?.length || 0;

  const renderHeaderItems = () => (
    <button
      className={styles["create-playlist-button"]}
      onClick={() => createPlaylist({ openInInspector: true })}
    >
      <p className={styles["button-text"]}>create playlist</p>{" "}
      <GoPlus className={styles.plus} />
    </button>
  );

  const type = "playlist";
  const listHeaderAttributes = ["#", "NAME", "SONGS", "CREATED AT"];
  const searchPlaceholder = "Search by name";

  return (
    <ListContent
      {...{
        type,
        onSearch,
        listHeaderAttributes,
        searchPlaceholder,
        renderHeaderItems,
        isLoading,
        fetchNextPage,
        hasNextPage,
        totalCount,
        shownCount,
      }}
    >
      {!!playlists?.length ? (
        playlists.map((playlist, i) => {
          const { id, name, tracks, createdAt } = playlist;
          const listNumber = i + 1;
          const listEntryData = [
            listNumber,
            name,
            tracks.length,
            new Date(createdAt).toLocaleDateString(),
          ];

          return (
            <ListEntry
              key={id}
              listEntryData={listEntryData}
              dark={isEven(i)}
              type={type}
              inspectableItem={{ type, id, displayName: playlist.name }}
            />
          );
        })
      ) : (
        <EmptyList searchTerm={searchTerm} type={type} />
      )}
    </ListContent>
  );
};

export default ErrorBoundaryWrapped(Playlists);
