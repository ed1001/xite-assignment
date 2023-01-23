import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Artist } from "../types";
import { DEFAULT_PAGE_LIMIT, rqGetEntity, rqGetSearchInterface } from "./util";
import { queryClient } from "./client";
import { rqGetAllTracks } from "./tracks";

/************
 * QUERY KEYS
 ************/

export const rq_artists_keys = {
  all: ["artists"] as const,
  id: (id: number) => [...rq_artists_keys.all, id] as const,
  searchInterface: () => [...rq_artists_keys.all, "searchInterface"] as const,
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

export const useArtist = (id: number) => {
  return useQuery<Artist>({
    queryKey: rq_artists_keys.id(id),
    queryFn: () =>
      rqGetEntity<Artist>(id, rq_artists_keys.id(id), rqGetAllArtists),
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
