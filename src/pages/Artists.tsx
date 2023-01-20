import { Content, LoadMoreButton } from "../components";
import { useState } from "react";
import { rq_artists_keys, useInfiniteArtists } from "../react-query/artists";
import { trimPreviousInfiniteQuery } from "../react-query/helpers";
import { useAddToInspector } from "../react-query/inspector";
import ListEntry from "../components/ListEntry";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteArtists(searchTerm);
  const artists = data?.pages.flatMap((page) => page.artists);
  const addToInspector = useAddToInspector().mutate;

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_artists_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  return (
    <Content
      header={"Artists"}
      searchable={true}
      onSearch={onSearch}
      placeholder={"Search by name"}
    >
      {artists?.map((artist, i) => {
        return (
          <ListEntry
            key={artist.id}
            dark={i % 2 === 0}
            style={{ gridTemplateColumns: "50px 1fr 1fr 50px" }}
          >
            <div>{i + 1}</div>
            <div>{artist.name}</div>
            <div>{artist.id}</div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                addToInspector({
                  type: "artist",
                  id: artist.id,
                })
              }
            >
              inspect
            </div>
          </ListEntry>
        );
      })}
      {hasNextPage && (
        <LoadMoreButton disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          Load more artists
        </LoadMoreButton>
      )}
    </Content>
  );
};

export default Artists;
