import { Content } from "../components";
import styles from "./Tracks.module.scss";
import { InspectableItem, Track } from "../types";
import classnames from "classnames";
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
          <RenderTrack
            key={track.xid}
            track={track}
            dark={i % 2 === 0}
            number={i + 1}
            addToInspector={addToInspector}
          />
        );
      })}
      <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        Load more
      </button>
    </Content>
  );
};

const RenderTrack = ({
  track,
  dark,
  number,
  addToInspector,
}: {
  track: Track;
  dark: boolean;
  number: number;
  addToInspector: (item: InspectableItem) => void;
}) => {
  return (
    <div className={classnames(styles.track, { [styles.dark]: dark })}>
      <div>{number}</div>
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
    </div>
  );
};

export default Tracks;
