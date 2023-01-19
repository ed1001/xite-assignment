import { Content } from "../components";
import { useInfiniteTracks } from "../react-query/hooks";
import styles from "./Tracks.module.scss";
import { Track } from "../types";
import classnames from "classnames";
import { BsMusicNote } from "react-icons/bs";
import { useState } from "react";
import { rq_tracks_keys } from "../react-query/keys";
import { trimPreviousInfiniteQuery } from "../react-query/helpers";

const Tracks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteTracks(searchTerm);
  const tracks = data?.pages.flatMap((page) => page.tracks);

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_tracks_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  return (
    <Content
      header={"Tracks"}
      searchable={true}
      onSearch={onSearch}
      placeholder={"Search by title"}
    >
      {tracks?.map((track, i) => {
        return <RenderTrack key={track.xid} track={track} dark={i % 2 === 0} />;
      })}
      <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        Load more
      </button>
    </Content>
  );
};

const RenderTrack = ({ track, dark }: { track: Track; dark: boolean }) => {
  return (
    <div className={classnames(styles.track, { [styles.dark]: dark })}>
      <BsMusicNote />
      <div className={styles.title}>
        <div>{track.title}</div>
        <div className={styles.artist}>{track.displayArtist}</div>
      </div>
    </div>
  );
};

export default Tracks;
