import { Content, ListEntry, LoadMoreButton } from "../components";
import styles from "./Tracks.module.scss";
import { useState } from "react";
import { rq_tracks_keys, useInfiniteTracks } from "../react-query/tracks";
import { trimPreviousInfiniteQuery } from "../react-query/helpers";
import { useAddToInspector } from "../react-query/inspector";

const Tracks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteTracks(searchTerm);
  const tracks = data?.pages.flatMap((page) => page.tracks);
  const addToInspector = useAddToInspector().mutate;

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_tracks_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  return (
    <Content
      header={"Tracks"}
      searchable={true}
      onSearch={onSearch}
      placeholder={"Search by title or artist name"}
    >
      {tracks?.map((track, i) => {
        return (
          <ListEntry
            key={track.xid}
            dark={i % 2 === 0}
            style={{ gridTemplateColumns: "50px 1fr 1fr 1fr 50px" }}
          >
            <div>{i + 1}</div>
            <div className={styles.title}>
              <div>{track.title}</div>
              <div className={styles.artist}>{track.displayArtist}</div>
            </div>
            <div>{track.genres.join(", ")}</div>
            <div>{new Date(track.createdAt).toDateString()}</div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                addToInspector({
                  type: "track",
                  id: track.id,
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
          Load more tracks
        </LoadMoreButton>
      )}
    </Content>
  );
};

export default Tracks;
