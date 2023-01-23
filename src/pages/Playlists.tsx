import { ListContent, ListEntry, LoadMoreButton } from "../components";
import {
  useCreatePlaylist,
  useInfinitePlaylists,
} from "../react-query/playlists";
import { trimPreviousInfiniteQuery } from "../react-query/util";
import { rq_tracks_keys } from "../react-query/tracks";
import { useState } from "react";
import { isEven } from "../util";

const Playlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfinitePlaylists(searchTerm);
  const playlists = data?.pages.flatMap((page) => page.playlists);
  const createPlaylist = useCreatePlaylist().mutate;
  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_tracks_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };
  const renderHeaderItems = () => (
    <button onClick={() => createPlaylist({})}>create playlist</button>
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
      }}
    >
      {playlists?.map((playlist, i) => {
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
      })}
      {hasNextPage && (
        <LoadMoreButton disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          Load more playlists
        </LoadMoreButton>
      )}
    </ListContent>
  );
};

export default Playlists;
