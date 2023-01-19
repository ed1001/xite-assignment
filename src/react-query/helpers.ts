import { Artist, Genre, Track } from "../types";
import { rq_tracks_keys } from "./keys";
import { getTracks } from "../api/xite";
import { queryClient } from "./hooks";

export const rqGetTracks = (): Promise<Track[]> =>
  queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.list(),
    queryFn: getTracks,
  });

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

export const rqGetGenres = async (): Promise<Genre[]> => {
  const tracks = await rqGetTracks();
  const genresNotUnique = tracks.flatMap((track) => track.genres);

  return [...new Set(genresNotUnique)];
};
