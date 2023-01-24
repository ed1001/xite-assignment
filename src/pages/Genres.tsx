import { useTrimPreviousInfiniteQuery } from "../react-query/util";
import {
  EmptyList,
  ErrorBoundaryWrapped,
  ListContent,
  ListEntry,
} from "../components";
import {
  rq_genres_keys,
  useGenreTotal,
  useInfiniteGenres,
} from "../react-query/genres";
import { useState } from "react";
import { isEven } from "../util";

const Genres = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteGenres(searchTerm);
  const { data: totalCount } = useGenreTotal(searchTerm);
  const trimPreviousInfiniteQuery = useTrimPreviousInfiniteQuery().mutate;

  const genres = data?.pages.flatMap((page) => page.genres);
  const shownCount = genres?.length || 0;
  const type = "genre";
  const listHeaderAttributes = ["#", "NAME", "TYPE"];
  const searchPlaceholder = "Search by name";

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_genres_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

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

export default ErrorBoundaryWrapped(Genres);
