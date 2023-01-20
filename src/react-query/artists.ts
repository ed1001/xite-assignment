import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Artist } from "../types";
import { DEFAULT_PAGE_LIMIT } from "./helpers";
import { queryClient } from "./client";
import { rqGetAllTracks } from "./tracks";
import Fuse from "fuse.js";

/************
 * QUERY KEYS
 ************/

export const rq_artists_keys = {
  single: ["artist"] as const,
  id: (id: number) => [...rq_artists_keys.single, id] as const,
  all: ["artists"] as const,
  list: (searchTerm?: string) =>
    [...rq_artists_keys.all, "list", searchTerm] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_artists_keys.all, "infinite", "list", searchTerm] as const,
};

/*******
 * HOOKS
 *******/

export const useInfiniteArtists = (searchTerm: string) => {
  return useInfiniteQuery<{
    artists: Artist[];
    paginationToken: number;
    nextPageAvailable: boolean;
  }>({
    queryKey: rq_artists_keys.infiniteList(searchTerm),
    queryFn: (page) => rqGetPaginatedArtists(page.pageParam, searchTerm),
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPageAvailable) {
        return;
      }

      return lastPage.paginationToken;
    },
  });
};

export const useArtists = () => {
  return useQuery<Artist[]>({
    queryKey: rq_artists_keys.list(),
    queryFn: rqGetAllArtists,
  });
};

export const useArtist = (id: number) => {
  return useQuery<Artist | undefined>({
    queryKey: rq_artists_keys.id(id),
    queryFn: async () => {
      const artists = await queryClient.ensureQueryData({
        queryKey: rq_artists_keys.list(),
        queryFn: rqGetAllArtists,
      });

      return artists.find((t) => t.id === id);
    },
  });
};

/******************
 * HELPER FUNCTIONS
 ******************/

export const rqGetAllArtists = async (): Promise<Artist[]> => {
  const tracks = await rqGetAllTracks();
  const artistsNotUnique = tracks.flatMap((track) =>
    track.artists.map((artistData) => artistData.artist)
  );

  const artistsUnique = [
    ...new Set(artistsNotUnique.map((a) => JSON.stringify(a))),
  ].map((a) => JSON.parse(a));

  return artistsUnique;
};

export const rqGetArtistsBySearchTerm = async (
  searchTerm: string
): Promise<Artist[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_artists_keys.list(searchTerm),
    queryFn: async () => {
      const artists = await rqGetAllArtists();
      const fuse = new Fuse(artists, {
        keys: ["name"],
        threshold: 0,
        ignoreLocation: true,
      });

      const results = fuse.search(searchTerm);
      return results.map((result) => result.item);
    },
  });
};

export const rqGetPaginatedArtists = async (
  pageParam: number = 0,
  searchTerm: string
): Promise<{
  artists: Artist[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const artists = searchTerm.length
    ? await rqGetArtistsBySearchTerm(searchTerm)
    : await rqGetAllArtists();
  const endIndex = pageParam + DEFAULT_PAGE_LIMIT;
  const paginationToken = pageParam + DEFAULT_PAGE_LIMIT;

  return {
    artists: artists.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < artists.length,
  };
};
