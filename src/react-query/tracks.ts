import { queryClient } from "./client";
import { GenreType, SubGenre, Track } from "../types";
import { getTracks } from "../api/xite";
import Fuse from "fuse.js";
import {
  DEFAULT_PAGE_LIMIT,
  rqGetEntity,
  rqGetSearchInterface,
  rqSetAndInvalidateQuery,
} from "./util";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const searchKeys: Array<string | Fuse.FuseOptionKey<Track>> = [
  "title",
  {
    name: "artistName",
    getFn: (track) => track.artists.map((artist) => artist.artist.name),
  },
];

/************
 * QUERY KEYS
 ************/

export const rq_tracks_keys = {
  all: ["tracks"] as const,
  id: (id: number) => [...rq_tracks_keys.all, id] as const,
  searchInterface: () => [...rq_tracks_keys.all, "searchInterface"] as const,
  total: (searchTerm?: string) =>
    [...rq_tracks_keys.all, "total", searchTerm] as const,
  list: (searchTerm?: string) =>
    [...rq_tracks_keys.all, "list", searchTerm] as const,
  listByArtist: (artistId: number) =>
    [...rq_tracks_keys.all, "list", artistId] as const,
  listByGenre: (genre?: GenreType | SubGenre) =>
    [...rq_tracks_keys.all, "list", genre] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_tracks_keys.all, "infinite", "list", searchTerm] as const,
};

/*******
 * HOOKS
 *******/

export const useInfiniteTracks = (searchTerm: string) => {
  return useInfiniteQuery<{
    tracks: Track[];
    paginationToken: number;
    nextPageAvailable: boolean;
  }>({
    queryKey: rq_tracks_keys.infiniteList(searchTerm),
    queryFn: (page) => rqGetPaginatedTracks(page.pageParam, searchTerm),
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPageAvailable) {
        return;
      }

      return lastPage.paginationToken;
    },
  });
};

export const useTracksByArtist = ({
  enabled,
  artistId,
}: {
  enabled: boolean;
  artistId: number;
}) => {
  return useQuery<Track[]>({
    queryKey: rq_tracks_keys.listByArtist(artistId),
    queryFn: () => rqGetTracksByArtist(artistId),
    enabled,
  });
};

export const useTracksByGenre = ({
  enabled,
  genre,
}: {
  enabled: boolean;
  genre?: GenreType | SubGenre;
}) => {
  return useQuery<Track[]>({
    queryKey: rq_tracks_keys.listByGenre(genre),
    queryFn: () => rqGetTracksByGenre(genre),
    enabled,
  });
};

export const useTrack = (id: number) => {
  return useQuery<Track>({
    queryKey: rq_tracks_keys.id(id),
    queryFn: () => rqGetTrack(id),
  });
};

export const useTrackTotal = (searchTerm: string) => {
  return useQuery<number>({
    queryKey: rq_tracks_keys.total(searchTerm),
    queryFn: () => getTotalTrackCount(searchTerm),
  });
};

/******************
 * HELPER FUNCTIONS
 ******************/

export const prefetchAllTracks = async () => {
  await queryClient.prefetchQuery({
    queryKey: rq_tracks_keys.list(),
    queryFn: rqGetAllTracks,
  });
};

export const rqGetAllTracks = async () => {
  return queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.list(),
    queryFn: getTracks,
  });
};

export const rqGetTrack = (id: number) =>
  rqGetEntity<Track>(id, rq_tracks_keys.id(id), rqGetAllTracks);

export const rqGetTracksBySearchTerm = async (
  searchTerm: string
): Promise<Track[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.list(searchTerm),
    queryFn: async () => {
      const tracks = await rqGetAllTracks();
      const searchInterface = await rqGetSearchInterface<Track>(
        rq_tracks_keys.searchInterface(),
        tracks,
        searchKeys
      );

      const results = searchInterface.search(searchTerm);
      return results.map((result) => result.item);
    },
  });
};

export const rqGetTracksByArtist = async (
  artistId: number
): Promise<Track[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.listByArtist(artistId),
    queryFn: async () => {
      const tracks = await rqGetAllTracks();

      return tracks.filter((track) =>
        track.artists
          .map((artistData) => artistData.artist.id)
          .includes(artistId)
      );
    },
  });
};

export const rqGetTracksByGenre = async (
  genre?: GenreType | SubGenre
): Promise<Track[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_tracks_keys.listByGenre(genre),
    queryFn: async () => {
      if (!genre) {
        return [];
      }

      const tracks = await rqGetAllTracks();

      return tracks.filter((track) =>
        [...track.genres, ...track.subGenres].includes(genre)
      );
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

  await rqSetAndInvalidateQuery<number>(
    rq_tracks_keys.total(searchTerm),
    tracks.length
  );

  const endIndex = pageParam + DEFAULT_PAGE_LIMIT;
  const paginationToken = pageParam + DEFAULT_PAGE_LIMIT;

  return {
    tracks: tracks.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < tracks.length,
  };
};

const getTotalTrackCount = async (searchTerm: string): Promise<number> =>
  queryClient.getQueryData(rq_tracks_keys.total(searchTerm)) || 0;
