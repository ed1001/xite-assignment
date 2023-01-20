import { queryClient } from "./client";
import { Track } from "../types";
import { getTracks } from "../api/xite";
import Fuse from "fuse.js";
import { DEFAULT_PAGE_LIMIT } from "./helpers";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

/************
 * QUERY KEYS
 ************/

export const rq_tracks_keys = {
  single: ["track"] as const,
  id: (id: number) => [...rq_tracks_keys.single, id] as const,
  all: ["tracks"] as const,
  list: (searchTerm?: string) =>
    [...rq_tracks_keys.all, "list", searchTerm] as const,
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

export const useTracks = () => {
  return useQuery<Track[]>({
    queryKey: rq_tracks_keys.list(),
    queryFn: rqGetAllTracks,
  });
};

export const useTrack = (id: number) => {
  return useQuery<Track | undefined>({
    queryKey: rq_tracks_keys.id(id),
    queryFn: async () => {
      const tracks = await rqGetAllTracks();

      return tracks.find((t) => t.id === id);
    },
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
