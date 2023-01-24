import React, { useState } from "react";
import { isEven } from "../util";
import { useTrimPreviousInfiniteQuery } from "../react-query/util";
import {
  rq_tracks_keys,
  useInfiniteTracks,
  useTrackTotal,
} from "../react-query/tracks";
import {
  AddToPlaylist,
  EmptyList,
  ErrorBoundaryWrapped,
  ListContent,
  ListEntry,
} from "../components";
import { Track } from "../types";

const Tracks = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteTracks(searchTerm);
  const { data: totalCount } = useTrackTotal(searchTerm);
  const trimPreviousInfiniteQuery = useTrimPreviousInfiniteQuery().mutate;

  const tracks = data?.pages.flatMap((page) => page.tracks);
  const shownCount = tracks?.length || 0;
  const type = "track";
  const listHeaderAttributes = ["#", "TITLE", "ARTIST", "GENRE"];
  const searchPlaceholder = "Search by title or artist";

  const onSearch = (queryString: string) => {
    trimPreviousInfiniteQuery(rq_tracks_keys.infiniteList(searchTerm));
    setSearchTerm(queryString);
  };

  const onDragStart = async (event: React.DragEvent, track: Track) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ trackId: track.id })
    );
  };

  return (
    <ListContent
      {...{
        type,
        onSearch,
        listHeaderAttributes,
        searchPlaceholder,
        isLoading,
        fetchNextPage,
        hasNextPage,
        totalCount,
        shownCount,
      }}
    >
      {!!tracks?.length ? (
        tracks.map((track, i) => {
          const { id, title, displayArtist, genres } = track;
          const listNumber = i + 1;
          const listEntryData = [
            listNumber,
            title,
            displayArtist,
            genres.join(", "),
            <AddToPlaylist track={track} origin={"list"} />,
          ];

          return (
            <ListEntry
              key={id}
              listEntryData={listEntryData}
              dark={isEven(i)}
              type={type}
              inspectableItem={{ type, id, displayName: title }}
              draggableProps={{
                draggable: true,
                onDragStart: (e: React.DragEvent) => onDragStart(e, track),
              }}
            />
          );
        })
      ) : (
        <EmptyList searchTerm={searchTerm} type={type} />
      )}
    </ListContent>
  );
};

export default ErrorBoundaryWrapped(Tracks);
