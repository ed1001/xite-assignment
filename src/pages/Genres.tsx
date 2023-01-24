import { EmptyList, ListContent, ListEntry } from "../components";
import {
  rq_genres_keys,
  useGenreTotal,
  useInfiniteGenres,
} from "../react-query/genres";
import { trimPreviousInfiniteQuery } from "../react-query/util";
import { useState } from "react";
import { isEven } from "../util";

const Genres = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteGenres(searchTerm);
  const genres = data?.pages.flatMap((page) => page.genres);
  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_genres_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };
  const { data: totalCount } = useGenreTotal(searchTerm);
  const shownCount = genres?.length || 0;

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
        fetchNextPage,
        hasNextPage,
        totalCount,
        shownCount,
      }}
    >
      {!!genres?.length ? (
        genres.map((genre, i) => {
          const { id, name, type: specificType } = genre;
          const listNumber = i + 1;
          const listEntryData = [listNumber, name, specificType];

          return (
            <ListEntry
              key={id}
              listEntryData={listEntryData}
              dark={isEven(i)}
              type={type}
              inspectableItem={{ type, id, displayName: genre.name }}
            />
          );
        })
      ) : (
        <EmptyList searchTerm={searchTerm} type={type} />
      )}
    </ListContent>
  );
};

export default Genres;
