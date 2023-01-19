import { QueryClient, useQuery } from "@tanstack/react-query";

import { Artist, Genre, Track } from "../types";
import { getTracks } from "../api/xite";
import { rq_artists_keys, rq_genres_keys, rq_tracks_keys } from "./keys";
import { rqGetArtists, rqGetGenres, rqGetTracks } from "./helpers";

/*************************************************************
 *
 * Retrieve all track metadata from endpoint then use the
 * data cached by React Query to emulate a kind of static
 * database from which we can extract all other more specific
 * data from.
 *
 * e.g useArtists extracts its data from the cached tracks data
 *
 *************************************************************/

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export const useTracks = () => {
  return useQuery<Track[]>({
    queryKey: rq_tracks_keys.list(),
    queryFn: getTracks,
  });
};

export const useTrack = (id: number) => {
  return useQuery<Track | undefined>({
    queryKey: rq_tracks_keys.id(id),
    queryFn: async () => {
      const tracks = await rqGetTracks();

      return tracks.find((t) => t.xid === id);
    },
  });
};

export const useArtists = () => {
  return useQuery<Artist[]>({
    queryKey: rq_artists_keys.list(),
    queryFn: rqGetArtists,
  });
};

export const useArtist = (id: number) => {
  return useQuery<Artist | undefined>({
    queryKey: rq_artists_keys.id(id),
    queryFn: async () => {
      const artists = await queryClient.ensureQueryData({
        queryKey: rq_artists_keys.list(),
        queryFn: rqGetArtists,
      });

      return artists.find((t) => t.id === id);
    },
  });
};

export const useGenres = () => {
  return useQuery<Genre[]>({
    queryKey: rq_genres_keys.list(),
    queryFn: rqGetGenres,
  });
};
