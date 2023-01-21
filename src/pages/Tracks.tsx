import {
  Content,
  InspectButton,
  ListEntry,
  LoadMoreButton,
} from "../components";
import styles from "./Tracks.module.scss";
import { useState } from "react";
import { rq_tracks_keys, useInfiniteTracks } from "../react-query/tracks";
import { trimPreviousInfiniteQuery } from "../react-query/helpers";
import { useAddToInspector } from "../react-query/inspector";
import ListHeader from "../components/ListHeader";

const Tracks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteTracks(searchTerm);
  const tracks = data?.pages.flatMap((page) => page.tracks);
  const addToInspector = useAddToInspector().mutate;

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_tracks_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  const style = { gridTemplateColumns: "50px 1fr 1fr 0.5fr 0.5fr 100px" };
  const preMainRender = () => (
    <ListHeader style={style}>
      <div>#</div>
      <div>TITLE</div>
      <div>ARTIST</div>
      <div>GENRE</div>
      <div>CREATED AT</div>
    </ListHeader>
  );

  return (
    <Content
      header={"Tracks"}
      preMainRender={preMainRender}
      searchProps={{
        searchable: true,
        placeholder: "Search by title or artist name",
        onSearch,
      }}
    >
      {tracks?.map((track, i) => {
        return (
          <ListEntry key={track.id} dark={i % 2 === 0} style={style}>
            <div>{i + 1}</div>
            <div>{track.title}</div>
            <div className={styles.artist}>{track.displayArtist}</div>
            <div>{track.genres.join(", ")}</div>
            <div>{new Date(track.createdAt).toLocaleDateString()}</div>
            <InspectButton
              onClick={() => addToInspector({ type: "track", entity: track })}
            />
          </ListEntry>
        );
      })}
      {hasNextPage && (
        <LoadMoreButton disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          Load more tracks
        </LoadMoreButton>
      )}
    </Content>
  );
};

export default Tracks;
