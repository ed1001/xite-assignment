import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Artist } from "../types";
import { DEFAULT_PAGE_LIMIT } from "./helpers";
import { queryClient } from "./client";
import { rqGetAllTracks } from "./tracks";

/************
 * QUERY KEYS
 ************/

export const rq_artists_keys = {
  single: ["artist"] as const,
  id: (id: number) => [...rq_artists_keys.single, id] as const,
  all: ["artists"] as const,
  list: () => [...rq_artists_keys.all, "list"] as const,
  infiniteList: () => [...rq_artists_keys.all, "infinite", "list"] as const,
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
    queryKey: rq_artists_keys.infiniteList(),
    queryFn: (page) => rqGetPaginatedArtists(page.pageParam),
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

/******************
 * HELPER FUNCTIONS
 ******************/

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
