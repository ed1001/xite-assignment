import { Content, InspectButton, LoadMoreButton } from "../components";
import { useState } from "react";
import { rq_artists_keys, useInfiniteArtists } from "../react-query/artists";
import { trimPreviousInfiniteQuery } from "../react-query/helpers";
import { useAddToInspector } from "../react-query/inspector";
import ListEntry from "../components/ListEntry";
import ListHeader from "../components/ListHeader";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteArtists(searchTerm);
  const artists = data?.pages.flatMap((page) => page.artists);
  const addToInspector = useAddToInspector().mutate;

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_artists_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  const style = { gridTemplateColumns: "50px 1fr 1fr 100px" };
  const preMainRender = () => (
    <ListHeader style={style}>
      <div>#</div>
      <div>NAME</div>
      <div>ID</div>
    </ListHeader>
  );

  return (
    <Content
      header={"Artists"}
      preMainRender={preMainRender}
      searchProps={{
        searchable: true,
        placeholder: "Search by name",
        onSearch,
      }}
    >
      {artists?.map((artist, i) => {
        return (
          <ListEntry key={artist.id} dark={i % 2 === 0} style={style}>
            <div>{i + 1}</div>
            <div>{artist.name}</div>
            <div>{artist.id}</div>
            <InspectButton
              onClick={() =>
                addToInspector({
                  type: "artist",
                  entity: artist,
                })
              }
            />
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
