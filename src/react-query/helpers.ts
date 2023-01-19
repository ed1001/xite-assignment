import { Artist, Genre, Track } from "../types";
import { rq_tracks_keys } from "./keys";
import { getTracks } from "../api/xite";
import { queryClient } from "./hooks";

const DEFAULT_PAGE_LIMIT = 15;

export const rqGetTracks = (): Promise<Track[]> =>
  queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.list(),
    queryFn: getTracks,
  });

export const rqGetPaginatedTracks = async (
  pageParam: number = 0
): Promise<{
  tracks: Track[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const tracks = await rqGetTracks();
  const endIndex = pageParam + DEFAULT_PAGE_LIMIT;
  const paginationToken = pageParam + DEFAULT_PAGE_LIMIT;

  return {
    tracks: tracks.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < tracks.length,
  };
};

export const rqGetArtists = async (): Promise<Artist[]> => {
  const tracks = await rqGetTracks();
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
  const tracks = await rqGetTracks();
  const genresNotUnique = tracks.flatMap((track) => track.genres);

  return [...new Set(genresNotUnique)];
};
