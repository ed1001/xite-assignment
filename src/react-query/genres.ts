import { Genre } from "../types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { rqGetAllTracks } from "./tracks";
import { queryClient } from "./client";
import {
  DEFAULT_PAGE_LIMIT,
  rqGetEntity,
  rqGetSearchInterface,
  rqSetAndInvalidateQuery,
} from "./util";

/************
 * QUERY KEYS
 ************/

export const rq_genres_keys = {
  all: ["genres"] as const,
  id: (id: number) => [...rq_genres_keys.all, id] as const,
  searchInterface: () => [...rq_genres_keys.all, "searchInterface"] as const,
  total: (searchTerm?: string) =>
    [...rq_genres_keys.all, "total", searchTerm] as const,
  list: (searchTerm?: string) =>
    [...rq_genres_keys.all, "list", searchTerm] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_genres_keys.all, "infinite", "list", searchTerm] as const,
};

/*******
 * HOOKS
 *******/

export const useInfiniteGenres = (
  searchTerm: string,
  limit: number = DEFAULT_PAGE_LIMIT
) => {
  return useInfiniteQuery<{
    genres: Genre[];
    paginationToken: number;
    nextPageAvailable: boolean;
  }>({
    queryKey: rq_genres_keys.infiniteList(searchTerm),
    queryFn: (page) => rqGetPaginatedGenres(page.pageParam, searchTerm, limit),
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

export const useGenreTotal = (searchTerm: string) => {
  return useQuery<number>({
    queryKey: rq_genres_keys.total(searchTerm),
    queryFn: () => getTotalGenreCount(searchTerm),
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
      const genresNotUnique = tracks.flatMap((track) => track.genres);
      const genresUnique = [...new Set(genresNotUnique)];
      const subGenresNotUnique = tracks.flatMap((track) => track.genres);
      const subGenresUnique = [...new Set(subGenresNotUnique)];
      const genres = genresUnique.map((genre, i) => ({
        name: genre,
        id: i + 1,
        type: "Genre",
      }));

      const subGenresStartIndex = genres.length + 1;
      const subGenres = subGenresUnique.map((genre, i) => ({
        name: genre,
        id: subGenresStartIndex + i,
        type: "Sub genre",
      }));

      return [...genres, ...subGenres];
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
        rq_genres_keys.searchInterface(),
        genres
      );

      const results = searchInterface.search(searchTerm);
      return results.map((result) => result.item);
    },
  });
};

export const rqGetPaginatedGenres = async (
  pageParam: number = 0,
  searchTerm: string,
  limit: number
): Promise<{
  genres: Genre[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const genres = searchTerm.length
    ? await rqGetGenresBySearchTerm(searchTerm)
    : await rqGetAllGenres();

  await rqSetAndInvalidateQuery<number>(
    rq_genres_keys.total(searchTerm),
    genres.length
  );
  const endIndex = pageParam + limit;
  const paginationToken = pageParam + limit;

  return {
    genres: genres.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < genres.length,
  };
};

const getTotalGenreCount = async (searchTerm: string): Promise<number> =>
  queryClient.getQueryData(rq_genres_keys.total(searchTerm)) || 0;
