import { Genre } from "../types";
import { useQuery } from "@tanstack/react-query";
import { rqGetAllTracks } from "./tracks";

/************
 * QUERY KEYS
 ************/

export const rq_genres_keys = {
  all: ["genres"] as const,
  list: () => [...rq_genres_keys.all, "list"] as const,
};

/*******
 * HOOKS
 *******/

export const useGenres = () => {
  return useQuery<Genre[]>({
    queryKey: rq_genres_keys.list(),
    queryFn: rqGetGenres,
  });
};

/******************
 * HELPER FUNCTIONS
 ******************/

export const rqGetGenres = async (): Promise<Genre[]> => {
  const tracks = await rqGetAllTracks();
  const genresNotUnique = tracks.flatMap((track) => track.genres);

  return [...new Set(genresNotUnique)];
};
