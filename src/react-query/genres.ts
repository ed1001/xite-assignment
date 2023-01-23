import { Genre } from "../types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { rq_tracks_keys, rqGetAllTracks } from "./tracks";
import { queryClient } from "./client";
import { DEFAULT_PAGE_LIMIT, rqGetEntity, rqGetSearchInterface } from "./util";

/************
 * QUERY KEYS
 ************/

export const rq_genres_keys = {
  all: ["genres"] as const,
  id: (id: number) => [...rq_genres_keys.all, id] as const,
  searchInterface: () => [...rq_genres_keys.all, "searchInterface"] as const,
  list: (searchTerm?: string) =>
    [...rq_genres_keys.all, "list", searchTerm] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_genres_keys.all, "infinite", "list", searchTerm] as const,
};

/*******
 * HOOKS
 *******/

export const useInfiniteGenres = (searchTerm: string) => {
  return useInfiniteQuery<{
    genres: Genre[];
    paginationToken: number;
    nextPageAvailable: boolean;
  }>({
    queryKey: rq_genres_keys.infiniteList(searchTerm),
    queryFn: (page) => rqGetPaginatedGenres(page.pageParam, searchTerm),
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPageAvailable) {
        return;
      }

      return lastPage.paginationToken;
    },
  });
};

export const useGenre = (id: number) => {
  return useQuery<Genre>({
    queryKey: rq_genres_keys.id(id),
    queryFn: () =>
      rqGetEntity<Genre>(id, rq_genres_keys.id(id), rqGetAllGenres),
  });
};

/******************
 * HELPER FUNCTIONS
 ******************/

export const rqGetAllGenres = async (): Promise<Genre[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_genres_keys.list(),
    queryFn: async () => {
      const tracks = await rqGetAllTracks();
      const genresNotUnique = tracks.flatMap((track) => [
        ...track.genres,
        ...track.subGenres,
      ]);
      const genresUnique = [...new Set(genresNotUnique)];

      return genresUnique.map((genre, i) => ({
        name: genre,
        id: i + 1,
      }));
    },
  });
};

export const rqGetGenresBySearchTerm = async (
  searchTerm: string
): Promise<Genre[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_genres_keys.list(searchTerm),
    queryFn: async () => {
      const genres = await rqGetAllGenres();
      const searchInterface = await rqGetSearchInterface<Genre>(
        rq_tracks_keys.searchInterface(),
        genres
      );

      const results = searchInterface.search(searchTerm);
      return results.map((result) => result.item);
    },
  });
};

export const rqGetPaginatedGenres = async (
  pageParam: number = 0,
  searchTerm: string
): Promise<{
  genres: Genre[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const genres = searchTerm.length
    ? await rqGetGenresBySearchTerm(searchTerm)
    : await rqGetAllGenres();
  const endIndex = pageParam + DEFAULT_PAGE_LIMIT;
  const paginationToken = pageParam + DEFAULT_PAGE_LIMIT;

  return {
    genres: genres.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < genres.length,
  };
};
