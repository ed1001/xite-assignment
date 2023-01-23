import { Entity, InspectableItem, Track } from "../../types";
import styles from "./Inspector.module.scss";
import { TbMoodSad } from "react-icons/tb";
import {
  useTrack,
  useTracksByArtist,
  useTracksByGenre,
} from "../../react-query/tracks";
import { useArtist } from "../../react-query/artists";
import { useGenre } from "../../react-query/genres";
import { ListEntry } from "../../components";
import { isEven } from "../../util";

interface Props {
  entity?: Entity;
  item: InspectableItem;
  tracks?: Track[];
  info?: { [key: string]: string | number | string[] };
}

const RenderEntity = ({ item, tracks, info }: Props) => {
  return (
    <div className={styles["item-container"]}>
      <div className={styles["item-header-container"]}>
        <h2 className={styles.description}>Artist Info </h2>
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
          <h3 style={{ marginBottom: "10px" }}>Latest tracks:</h3>
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
  const { data: track } = useTrack(item.id);

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

  return (
    <RenderEntity
      entity={track}
      item={item}
      info={{ ...additionalInfo, ...rest }}
    />
  );
};

export const RenderArtist = ({ item }: { item: InspectableItem }) => {
  const { data: artist } = useArtist(item.id);
  const { data: tracks } = useTracksByArtist({
    enabled: !!artist,
    artistId: item.id,
  });

  if (!artist) {
    return <EmptyItem item={item} />;
  }

  const info = {
    tracks: tracks?.length || 0,
    genres:
      tracks?.flatMap((track) => [...track.genres, ...track.subGenres]) || [],
  };

  const latestTracks = tracks?.slice(0, 20);

  return (
    <RenderEntity
      entity={artist}
      item={item}
      tracks={latestTracks}
      info={info}
    />
  );
};

export const RenderGenre = ({ item }: { item: InspectableItem }) => {
  const { data: genre } = useGenre(item.id);
  const { data: tracks } = useTracksByGenre({
    enabled: !!genre,
    genre: genre?.name,
  });

  if (!genre) {
    return <EmptyItem item={item} />;
  }

  const latestTracks = tracks?.slice(0, 20) || [];

  return <RenderEntity entity={genre} item={item} tracks={latestTracks} />;
};
