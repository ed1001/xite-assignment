import { Content } from "../components";
import { useInfiniteTracks } from "../react-query/hooks";
import styles from "./Tracks.module.scss";
import { Track } from "../types";
import classnames from "classnames";
import { BsMusicNote } from "react-icons/bs";

const Tracks = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteTracks("");

  return (
    <Content header={"Tracks"} searchable={true}>
      {data?.pages.flatMap((page) => {
        return page.tracks.map((track, i) => {
          return <RenderTrack track={track} dark={i % 2 === 0} />;
        });
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
