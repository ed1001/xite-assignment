import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Playlist } from "../types";
import {
  DEFAULT_PAGE_LIMIT,
  rqGetEntity,
  rqGetSearchInterface,
  rqSetAndInvalidateQuery,
} from "./util";
import { queryClient } from "./client";
import {
  rqAddToInspectedItems,
  rqRemoveFromInspector,
  rqUpdateInspectedItem,
} from "./inspector";
import { rqGetTrack } from "./tracks";

/************
 * QUERY KEYS
 ************/

export const rq_playlists_keys = {
  all: ["playlists"] as const,
  id: (id: number) => [...rq_playlists_keys.all, id] as const,
  searchInterface: () => [...rq_playlists_keys.all, "searchInterface"] as const,
  total: (searchTerm?: string) =>
    [...rq_playlists_keys.all, "total", searchTerm] as const,
  list: (searchTerm?: string) =>
    [...rq_playlists_keys.all, "list", searchTerm] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_playlists_keys.all, "infinite", "list", searchTerm] as const,
};

export const persistedKeys = [rq_playlists_keys.list()];

/*******
 * HOOKS
 *******/

export const useInfinitePlaylists = (
  searchTerm: string,
  limit: number = DEFAULT_PAGE_LIMIT
) => {
  return useInfiniteQuery<{
    playlists: Playlist[];
    paginationToken: number;
    nextPageAvailable: boolean;
  }>({
    queryKey: rq_playlists_keys.infiniteList(searchTerm),
    queryFn: (page) =>
      rqGetPaginatedPlaylists(page.pageParam, searchTerm, limit),
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
    queryFn: () => rqGetPlaylist(id),
  });
};

export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: async ({
      trackId,
      openInInspector = false,
    }: {
      trackId?: number;
      openInInspector?: boolean;
    }) => {
      const addedAt = new Date().toISOString();
      const track = trackId && (await rqGetTrack(trackId));
      const tracks = track ? [{ track, addedAt }] : [];
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
      trackId,
      playlistId,
      openInInspector = false,
    }: {
      trackId: number;
      playlistId: number;
      openInInspector?: boolean;
    }) => {
      const playlist = await rqGetPlaylist(playlistId);
      const addedAt = new Date().toISOString();
      const track = await rqGetTrack(trackId);
      const updatedPlaylist = {
        ...playlist,
        tracks: [...playlist.tracks, { track, addedAt }],
      };

      queryClient.setQueryData(
        rq_playlists_keys.list(),
        (prev: Playlist[] | undefined) => {
          return prev?.map((pl) => {
            if (pl.id === playlist.id) {
              return updatedPlaylist;
            }

            return pl;
          });
        }
      );

      return { playlist: updatedPlaylist, openInInspector };
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

export const useRemovePlaylist = () => {
  return useMutation({
    mutationFn: async (playlist: Playlist) => {
      queryClient.setQueryData(
        rq_playlists_keys.list(),
        (prev: Playlist[] | undefined) => {
          return prev?.filter((p) => p.id !== playlist.id);
        }
      );
      return playlist.id;
    },
    onSuccess: async (id: number) => {
      await rqRemoveFromInspector(id, "playlist");
      await queryClient.invalidateQueries(rq_playlists_keys.all);
    },
  });
};

export const useEditPlaylistName = () => {
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const playlist = await rqGetPlaylist(id);
      const updatedPlaylist = { ...playlist, name };

      queryClient.setQueryData(
        rq_playlists_keys.list(),
        (prev: Playlist[] | undefined) => {
          return prev?.map((pl) => {
            if (pl.id === playlist.id) {
              return updatedPlaylist;
            }

            return pl;
          });
        }
      );

      await rqUpdateInspectedItem(id, {
        type: "playlist",
        id,
        displayName: name,
      });
      await queryClient.invalidateQueries(rq_playlists_keys.all);
    },
  });
};

export const usePlaylistTotal = (searchTerm: string) => {
  return useQuery<number>({
    queryKey: rq_playlists_keys.total(searchTerm),
    queryFn: () => getTotalPlaylistCount(searchTerm),
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
  searchTerm: string,
  limit: number
): Promise<{
  playlists: Playlist[];
  paginationToken: number;
  nextPageAvailable: boolean;
}> => {
  const playlists = searchTerm.length
    ? await rqGetPlaylistsBySearchTerm(searchTerm)
    : await rqGetAllPlaylists();

  await rqSetAndInvalidateQuery<number>(
    rq_playlists_keys.total(searchTerm),
    playlists.length
  );

  const endIndex = pageParam + limit;
  const paginationToken = pageParam + limit;

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

const getTotalPlaylistCount = async (searchTerm: string): Promise<number> =>
  queryClient.getQueryData(rq_playlists_keys.total(searchTerm)) || 0;

export const rqGetPlaylist = (id: number) =>
  rqGetEntity<Playlist>(id, rq_playlists_keys.id(id), rqGetAllPlaylists);
