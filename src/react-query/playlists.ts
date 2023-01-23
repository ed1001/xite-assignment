import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Playlist, Track } from "../types";
import { DEFAULT_PAGE_LIMIT, rqGetEntity, rqGetSearchInterface } from "./util";
import { queryClient } from "./client";
import { rqAddToInspectedItems } from "./inspector";

/************
 * QUERY KEYS
 ************/

export const rq_playlists_keys = {
  all: ["playlists"] as const,
  id: (id: number) => [...rq_playlists_keys.all, id] as const,
  searchInterface: () => [...rq_playlists_keys.all, "searchInterface"] as const,
  list: (searchTerm?: string) =>
    [...rq_playlists_keys.all, "list", searchTerm] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_playlists_keys.all, "infinite", "list", searchTerm] as const,
};

export const persistedKeys = [rq_playlists_keys.list()];

/*******
 * HOOKS
 *******/

export const useInfinitePlaylists = (searchTerm: string) => {
  return useInfiniteQuery<{
    playlists: Playlist[];
    paginationToken: number;
    nextPageAvailable: boolean;
  }>({
    queryKey: rq_playlists_keys.infiniteList(searchTerm),
    queryFn: (page) => rqGetPaginatedPlaylists(page.pageParam, searchTerm),
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPageAvailable) {
        return;
      }

      return lastPage.paginationToken;
    },
  });
};

export const usePlaylists = () => {
  return useQuery<Playlist[]>({
    queryKey: rq_playlists_keys.list(),
    queryFn: rqGetAllPlaylists,
  });
};

export const usePlaylist = (id: number) => {
  return useQuery<Playlist>({
    queryKey: rq_playlists_keys.id(id),
    queryFn: () =>
      rqGetEntity<Playlist>(id, rq_playlists_keys.id(id), rqGetAllPlaylists),
  });
};

export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: async ({
      track,
      openInInspector = false,
    }: {
      track?: Track;
      openInInspector?: boolean;
    }) => {
      const tracks = track ? [track] : [];
      const id = await getIncrementedId();
      const name = `Untitled Playlist ${id}`;
      const createdAt = new Date().toISOString();
      const playlist: Playlist = { id, name, tracks, createdAt };

      queryClient.setQueryData(
        rq_playlists_keys.list(),
        (prev: Playlist[] | undefined) => {
          return [playlist, ...(prev || [])];
        }
      );

      return { openInInspector, playlist };
    },
    onSuccess: async ({ openInInspector, playlist }) => {
      await queryClient.invalidateQueries(rq_playlists_keys.all);
      if (openInInspector) {
        const { id, name } = playlist;
        await rqAddToInspectedItems({
          type: "playlist",
          id,
          displayName: name,
        });
      }
    },
  });
};

export const useAddToPlaylist = () => {
  return useMutation({
    mutationFn: async ({
      track,
      playlist,
    }: {
      track: Track;
      playlist: Playlist;
    }) => {
      const updatedPlaylist = {
        ...playlist,
        tracks: [...playlist.tracks, track],
      };

      queryClient.setQueryData(
        rq_playlists_keys.list(),
        (prev: Playlist[] | undefined) => {
          if (!prev) {
            return;
          }

          return prev.map((pl) => {
            if (pl.id === playlist.id) {
              return updatedPlaylist;
            }

            return pl;
          });
        }
      );

      return playlist.id;
    },
    onSuccess: async (playlistId) => {
      await queryClient.invalidateQueries(rq_playlists_keys.all);
      await queryClient.invalidateQueries(rq_playlists_keys.id(playlistId));
    },
  });
};

export const useRemovePlaylist = () => {
  return useMutation({
    mutationFn: async (playlist: Playlist) => {
      queryClient.setQueryData(
        rq_playlists_keys.list(),
        (prev: Playlist[] | undefined) => {
          return prev?.filter((p) => p.id !== playlist.id);
        }
      );
    },
  });
};

/******************
 * HELPER FUNCTIONS
 ******************/

export const rqGetAllPlaylists = async (): Promise<Playlist[]> =>
  queryClient.getQueryData(rq_playlists_keys.list()) || [];

export const rqGetPlaylistsBySearchTerm = async (
  searchTerm: string
): Promise<Playlist[]> => {
  return queryClient.ensureQueryData({
    queryKey: rq_playlists_keys.list(searchTerm),
    queryFn: async () => {
      const playlists = await rqGetAllPlaylists();
      const searchInterface = await rqGetSearchInterface<Playlist>(
        rq_playlists_keys.searchInterface(),
        playlists
      );

      const results = searchInterface.search(searchTerm);
      return results.map((result) => result.item);
    },
  });
};

export const rqGetPaginatedPlaylists = async (
  pageParam: number = 0,
  searchTerm: string
): Promise<{
  playlists: Playlist[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const playlists = searchTerm.length
    ? await rqGetPlaylistsBySearchTerm(searchTerm)
    : await rqGetAllPlaylists();
  const endIndex = pageParam + DEFAULT_PAGE_LIMIT;
  const paginationToken = pageParam + DEFAULT_PAGE_LIMIT;

  return {
    playlists: playlists.slice(pageParam, endIndex),
    paginationToken,
    nextPageAvailable: paginationToken < playlists.length,
  };
};

const getIncrementedId = async () => {
  const playlists = await rqGetAllPlaylists();
  const ids = playlists.map(({ id }) => id);

  return ids.length ? Math.max(...ids) + 1 : 1;
};
