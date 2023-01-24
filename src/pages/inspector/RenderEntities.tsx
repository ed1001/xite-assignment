import capitalize from "lodash.capitalize";
import styles from "./Inspector.module.scss";
import { TbMoodSad } from "react-icons/tb";
import { isEven } from "../../util";
import {
  useTrack,
  useTracksByArtist,
  useTracksByGenre,
} from "../../react-query/tracks";
import { useArtist } from "../../react-query/artists";
import { useGenre } from "../../react-query/genres";
import { AddToPlaylist, ListEntry } from "../../components";
import { InspectableItem, Track } from "../../types";

interface Props {
  item: InspectableItem;
  tracks?: Track[];
  info?: { [key: string]: string | number | string[] };
}

const RenderEntity = ({ item, tracks, info }: Props) => {
  return (
    <div className={styles["item-container"]}>
      <div className={styles["item-header-container"]}>
        <h2 className={styles.description}>{capitalize(item.type)}</h2>
        <h2>{item.displayName}</h2>
      </div>
      {info &&
        Object.entries(info).map(([key, value]) => {
          const string = Array.isArray(value) ? value.join(", ") : value;
          return (
            <div key={`${key}:${string}`}>
              <>
                <b>{key}</b>: {string || "none"}
              </>
            </div>
          );
        })}
      <br />
      {!!tracks?.length && (
        <>
          <h3>Latest tracks:</h3>
          <div className={styles["tracks-container"]}>
            {tracks.map((track, i) => {
              return (
                <ListEntry
                  key={track.id}
                  listEntryData={[track.title]}
                  dark={isEven(i)}
                  type={"track-abbreviated"}
                  inspectableItem={{
                    type: "track",
                    id: track.id,
                    displayName: track.title,
                  }}
                  addToPlaylist={
                    <AddToPlaylist track={track} origin={"inspector"} />
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export const EmptyItem = ({ item }: { item: InspectableItem }) => {
  return (
    <div className={styles.empty}>
      <TbMoodSad />
      <p>
        Something went wrong... {item.type} not found! <br />
        <br /> Try closing this tab and reopening
      </p>
    </div>
  );
};

export const RenderTrack = ({ item }: { item: InspectableItem }) => {
  const { data: track, isLoading } = useTrack(item.id);

  if (isLoading) {
    return null;
  }

  if (!track) {
    return <EmptyItem item={item} />;
  }

  const {
    title,
    displayArtist,
    artists: artistDataList,
    createdAt,
    updatedAt,
    ...rest
  } = track;
  const artists = artistDataList.map(({ artist }) => artist.name);
  const additionalInfo = {
    artists,
    createdAt: new Date(createdAt).toLocaleDateString(),
    updatedAt: new Date(updatedAt).toLocaleDateString(),
  };

  return <RenderEntity item={item} info={{ ...additionalInfo, ...rest }} />;
};

export const RenderArtist = ({ item }: { item: InspectableItem }) => {
  const { data: artist, isLoading: artistsLoading } = useArtist(item.id);
  const { data: tracks, isLoading: tracksLoading } = useTracksByArtist({
    enabled: !!artist,
    artistId: item.id,
  });

  const isLoading = artistsLoading || tracksLoading;

  if (isLoading) {
    return null;
  }

  if (!artist) {
    return <EmptyItem item={item} />;
  }

  const info = {
    tracks: tracks?.length || 0,
    genres:
      tracks?.flatMap((track) => [...track.genres, ...track.subGenres]) || [],
  };

  const latestTracks = tracks?.slice(0, 20);

  return <RenderEntity item={item} tracks={latestTracks} info={info} />;
};

export const RenderGenre = ({ item }: { item: InspectableItem }) => {
  const { data: genre, isLoading: genreLoading } = useGenre(item.id);
  const { data: tracks, isLoading: tracksLoading } = useTracksByGenre({
    enabled: !!genre,
    genre: genre?.name,
  });

  const isLoading = genreLoading || tracksLoading;

  if (isLoading) {
    return null;
  }

  if (!genre) {
    return <EmptyItem item={item} />;
  }

  const latestTracks = tracks?.slice(0, 20) || [];

  return <RenderEntity item={item} tracks={latestTracks} />;
};
