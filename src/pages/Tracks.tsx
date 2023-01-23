import {
  AddToPlaylist,
  ListContent,
  ListEntry,
  LoadMoreButton,
} from "../components";
import { useState } from "react";
import { rq_tracks_keys, useInfiniteTracks } from "../react-query/tracks";
import { trimPreviousInfiniteQuery } from "../react-query/util";
import { isEven } from "../util";

const Tracks = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteTracks(searchTerm);
  const tracks = data?.pages.flatMap((page) => page.tracks);
  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_tracks_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  const type = "track";
  const listHeaderAttributes = ["#", "TITLE", "ARTIST", "GENRE"];
  const searchPlaceholder = "Search by title or artist name";

  return (
    <ListContent
      {...{ type, onSearch, listHeaderAttributes, searchPlaceholder }}
    >
      {tracks?.map((track, i) => {
        const { id, title, displayArtist, genres } = track;
        const listNumber = i + 1;
        const listEntryData = [
          listNumber,
          title,
          displayArtist,
          genres.join(", "),
          <AddToPlaylist track={track} origin={"list"} />,
        ];

        return (
          <ListEntry
            key={id}
            listEntryData={listEntryData}
            dark={isEven(i)}
            type={type}
            inspectableItem={{ type, id, displayName: title }}
          />
        );
      })}
      {hasNextPage && (
        <LoadMoreButton disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          Load more tracks
        </LoadMoreButton>
      )}
    </ListContent>
  );
};

export default Tracks;
