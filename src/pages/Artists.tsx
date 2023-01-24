import React, { useState } from "react";
import { isEven } from "../util";
import {
  rq_artists_keys,
  useArtistTotal,
  useInfiniteArtists,
} from "../react-query/artists";
import { EmptyList, ErrorBoundaryWrapped, ListContent } from "../components";
import ListEntry from "../components/ListEntry";
import { useTrimPreviousInfiniteQuery } from "../react-query/util";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteArtists(searchTerm);
  const { data: totalCount } = useArtistTotal(searchTerm);
  const trimPreviousInfiniteQuery = useTrimPreviousInfiniteQuery().mutate;

  const artists = data?.pages.flatMap((page) => page.artists) || [];
  const shownCount = artists?.length || 0;
  const type = "artist";
  const listHeaderAttributes = ["#", "NAME"];
  const searchPlaceholder = "Search by name";

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_artists_keys.infiniteList(searchTerm));
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
      {!!artists?.length ? (
        artists.map((artist, i) => {
          const { id, name } = artist;
          const listNumber = i + 1;
          const listEntryData = [listNumber, name];

          return (
            <ListEntry
              key={id}
              listEntryData={listEntryData}
              dark={isEven(i)}
              type={type}
              inspectableItem={{ type, id, displayName: artist.name }}
            />
          );
        })
      ) : (
        <EmptyList searchTerm={searchTerm} type={type} />
      )}
    </ListContent>
  );
};

export default ErrorBoundaryWrapped(Artists);
