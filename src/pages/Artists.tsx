import { ListContent, LoadMoreButton } from "../components";
import { useState } from "react";
import { rq_artists_keys, useInfiniteArtists } from "../react-query/artists";
import { trimPreviousInfiniteQuery } from "../react-query/helpers";
import ListEntry from "../components/ListEntry";
import { isEven } from "../util";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteArtists(searchTerm);
  const artists = data?.pages.flatMap((page) => page.artists) || [];
  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_artists_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  const type = "artist";
  const listHeaderAttributes = ["#", "NAME", "ID"];
  const searchPlaceholder = "Search by name";

  return (
    <ListContent
      {...{ type, onSearch, listHeaderAttributes, searchPlaceholder }}
    >
      {artists?.map((artist, i) => {
        const { id, name } = artist;
        const listNumber = i + 1;
        const listEntryData = [listNumber, name, id];

        return (
          <ListEntry
            key={id}
            listEntryData={listEntryData}
            dark={isEven(i)}
            type={type}
            inspectableItem={{ type, entity: artist }}
          />
        );
      })}
      {hasNextPage && (
        <LoadMoreButton disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          Load more artists
        </LoadMoreButton>
      )}
    </ListContent>
  );
};

export default Artists;
