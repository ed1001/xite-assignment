import { Content } from "../components";
import { useInfiniteArtists } from "../react-query/hooks";
import { Artist } from "../types";
import classnames from "classnames";
import styles from "./Tracks.module.scss";

const Artists = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteArtists("");

  return (
    <Content header={"Artists"} searchable={true}>
      {data?.pages.flatMap((page) => {
        return page.artists.map((artist, i) => {
          return <RenderArtist artist={artist} dark={i % 2 === 0} />;
        });
      })}
      <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        Load more
      </button>
    </Content>
  );
};

const RenderArtist = ({ artist, dark }: { artist: Artist; dark: boolean }) => {
  return (
    <div className={classnames(styles.artist, { [styles.dark]: dark })}>
      <div className={styles.title}>{artist.name}</div>
    </div>
  );
};

export default Artists;
