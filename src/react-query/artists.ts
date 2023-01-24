import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Artist } from "../types";
import {
  DEFAULT_PAGE_LIMIT,
  rqGetEntity,
  rqGetSearchInterface,
  rqSetAndInvalidateQuery,
} from "./util";
import { queryClient } from "./client";
import { rqGetAllTracks } from "./tracks";

/************
 * QUERY KEYS
 ************/

export const rq_artists_keys = {
  all: ["artists"] as const,
  id: (id: number) => [...rq_artists_keys.all, id] as const,
  searchInterface: () => [...rq_artists_keys.all, "searchInterface"] as const,
  total: (searchTerm?: string) =>
    [...rq_artists_keys.all, "total", searchTerm] as const,
  list: (searchTerm?: string) =>
    [...rq_artists_keys.all, "list", searchTerm] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_artists_keys.all, "infinite", "list", searchTerm] as const,
};

/*******
 * HOOKS
 *******/

export const useInfiniteArtists = (
  searchTerm: string,
  limit: number = DEFAULT_PAGE_LIMIT
) => {
  return useInfiniteQuery<{
    artists: Artist[];
    paginationToken: number;
    nextPageAvailable: boolean;
  }>({
    queryKey: rq_artists_keys.infiniteList(searchTerm),
    queryFn: (page) => rqGetPaginatedArtists(page.pageParam, searchTerm, limit),
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPageAvailable) {
        return;
      }

      return lastPage.paginationToken;
    },
  });
};

export const useArtist = (id: number) => {
  return useQuery<Artist>({
    queryKey: rq_artists_keys.id(id),
    queryFn: () =>
      rqGetEntity<Artist>(id, rq_artists_keys.id(id), rqGetAllArtists),
  });
};

export const useArtistTotal = (searchTerm: string) => {
  return useQuery<number>({
    queryKey: rq_artists_keys.total(searchTerm),
    queryFn: () => getTotalArtistCount(searchTerm),
  });
};

/******************
 * HELPER FUNCTIONS
 ******************/

export const rqGetAllArtists = async (): Promise<Artist[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_artists_keys.list(),
    queryFn: async () => {
      const tracks = await rqGetAllTracks();
      const artistsNotUnique = tracks.flatMap((track) =>
        track.artists.map((artistData) => artistData.artist)
      );

      const artistsUnique = [
        ...new Set(artistsNotUnique.map((a) => JSON.stringify(a))),
      ].map((a) => JSON.parse(a));

      return artistsUnique;
    },
  });
};

export const rqGetArtistsBySearchTerm = async (
  searchTerm: string
): Promise<Artist[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_artists_keys.list(searchTerm),
    queryFn: async () => {
      const artists = await rqGetAllArtists();
      const searchInterface = await rqGetSearchInterface<Artist>(
        rq_artists_keys.searchInterface(),
        artists
      );

      const results = searchInterface.search(searchTerm);
      return results.map((result) => result.item);
    },
  });
};

export const rqGetPaginatedArtists = async (
  pageParam: number = 0,
  searchTerm: string,
  limit: number
): Promise<{
  artists: Artist[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const artists = searchTerm.length
    ? await rqGetArtistsBySearchTerm(searchTerm)
    : await rqGetAllArtists();

  await rqSetAndInvalidateQuery<number>(
    rq_artists_keys.total(searchTerm),
    artists.length
  );

  const endIndex = pageParam + limit;
  const paginationToken = pageParam + limit;

  return {
    artists: artists.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < artists.length,
  };
};

const getTotalArtistCount = async (searchTerm: string): Promise<number> =>
  queryClient.getQueryData(rq_artists_keys.total(searchTerm)) || 0;
