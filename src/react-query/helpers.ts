import { Artist, Genre, Track } from "../types";
import { rq_tracks_keys } from "./keys";
import { getTracks } from "../api/xite";
import { queryClient } from "./hooks";
import Fuse from "fuse.js";
import { QueryKey } from "@tanstack/query-core/src/types";

const DEFAULT_PAGE_LIMIT = 15;

export const prefetchAllTracks = async () => {
  await queryClient.prefetchQuery({
    queryKey: rq_tracks_keys.list(),
    queryFn: rqGetAllTracks,
  });
};

export const rqGetAllTracks = (): Promise<Track[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.list(),
    queryFn: getTracks,
  });
};

export const rqGetTracksBySearchTerm = async (
  searchTerm: string
): Promise<Track[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.list(searchTerm),
    queryFn: async () => {
      const tracks = await rqGetAllTracks();
      const fuse = new Fuse(tracks, {
        keys: [
          "title",
          {
            name: "artistName",
            getFn: (track) => track.artists.map((artist) => artist.artist.name),
          },
        ],
        threshold: 0,
        ignoreLocation: true,
      });

      const results = fuse.search(searchTerm);
      return results.map((result) => result.item);
    },
  });
};

export const rqGetPaginatedTracks = async (
  pageParam: number = 0,
  searchTerm: string
): Promise<{
  tracks: Track[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const tracks = searchTerm.length
    ? await rqGetTracksBySearchTerm(searchTerm)
    : await rqGetAllTracks();

  const endIndex = pageParam + DEFAULT_PAGE_LIMIT;
  const paginationToken = pageParam + DEFAULT_PAGE_LIMIT;

  return {
    tracks: tracks.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < tracks.length,
  };
};

// Reset a searched query to the first page if another search is made
export const trimPreviousInfiniteQuery = (queryKey: QueryKey) => {
  if (!queryClient.getQueryState(queryKey)) {
    return;
  }

  queryClient.setQueryData(queryKey, ({ pages, pageParams }) => {
    console.log(pages);
    return {
      pages: pages.slice(0, 1),
      pageParams: pageParams.slice(0, 1),
    };
  });
};

export const rqGetArtists = async (): Promise<Artist[]> => {
  const tracks = await rqGetAllTracks();
  const artistsNotUnique = tracks.flatMap((track) =>
    track.artists.map((artistData) => artistData.artist)
  );

  const artistsUnique = [
    ...new Set(artistsNotUnique.map((a) => JSON.stringify(a))),
  ].map((a) => JSON.parse(a));

  return artistsUnique;
};

export const rqGetPaginatedArtists = async (
  pageParam: number = 0
): Promise<{
  artists: Artist[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const artists = await rqGetArtists();
  const endIndex = pageParam + DEFAULT_PAGE_LIMIT;
  const paginationToken = pageParam + DEFAULT_PAGE_LIMIT;

  return {
    artists: artists.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < artists.length,
  };
};

export const rqGetGenres = async (): Promise<Genre[]> => {
  const tracks = await rqGetAllTracks();
  const genresNotUnique = tracks.flatMap((track) => track.genres);

  return [...new Set(genresNotUnique)];
};
