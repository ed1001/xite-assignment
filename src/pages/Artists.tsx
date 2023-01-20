import classnames from "classnames";

import { Artist } from "../types";
import styles from "./Tracks.module.scss";
import { useInfiniteArtists } from "../react-query/artists";
import { Content } from "../components";

const Artists = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteArtists("");
  const artists = data?.pages.flatMap((page) => {
    return page.artists;
  });

  return (
    <Content
      header={"Artists"}
      searchable={true}
      placeholder={"Search by name"}
    >
      {artists?.map((artist, i) => (
        <RenderArtist artist={artist} dark={i % 2 === 0} />
      ))}

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
