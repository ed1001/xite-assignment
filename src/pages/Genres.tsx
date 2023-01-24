import { ListContent, ListEntry, LoadMoreButton } from "../components";
import { useInfiniteGenres } from "../react-query/genres";
import { trimPreviousInfiniteQuery } from "../react-query/util";
import { rq_tracks_keys } from "../react-query/tracks";
import { useState } from "react";
import { isEven } from "../util";

const Genres = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteGenres(searchTerm);
  const genres = data?.pages.flatMap((page) => page.genres);
  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_tracks_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  const type = "genre";
  const listHeaderAttributes = ["#", "NAME", "TYPE"];
  const searchPlaceholder = "Search by name";

  return (
    <ListContent
      {...{
        type,
        onSearch,
        listHeaderAttributes,
        searchPlaceholder,
        isLoading,
      }}
    >
      {genres?.map((genre, i) => {
        const { id, name, type: specificType } = genre;
        const listNumber = i + 1;
        const listEntryData = [listNumber, name, specificType];

        return (
          <ListEntry
            key={`${name}`}
            listEntryData={listEntryData}
            dark={isEven(i)}
            type={type}
            inspectableItem={{ type, id, displayName: genre.name }}
          />
        );
      })}
      {hasNextPage && (
        <LoadMoreButton disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          Load more genres
        </LoadMoreButton>
      )}
    </ListContent>
  );
};

export default Genres;
