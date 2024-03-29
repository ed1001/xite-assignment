import { QueryKey } from "@tanstack/query-core/src/types";
import { useMutation } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { queryClient } from "./client";

export const DEFAULT_PAGE_LIMIT = 50;

// Reset the previously searched query to the first page when a new search is made

export const useTrimPreviousInfiniteQuery = () => {
  return useMutation({
    mutationFn: async (queryKey: QueryKey) =>
      trimPreviousInfiniteQuery(queryKey),
  });
};

const trimPreviousInfiniteQuery = (queryKey: QueryKey) => {
  if (!queryClient.getQueryState(queryKey)) {
    return;
  }

  queryClient.setQueryData(queryKey, ({ pages, pageParams }) => {
    return {
      pages: pages.slice(0, 1),
      pageParams: pageParams.slice(0, 1),
    };
  });
};

export const rqGetEntity = async <T extends { id: number }>(
  id: number,
  queryKey: QueryKey,
  getter: () => Promise<T[]>
): Promise<T> => {
  const items = await getter();

  const item = items.find((t) => t.id === id);

  if (!item) {
    throw new Error("Entity not found");
  }

  return item;
};

export const rqGetSearchInterface = <T>(
  queryKey: QueryKey,
  items: T[],
  keys?: Array<string | Fuse.FuseOptionKey<T>>
) => {
  return queryClient.ensureQueryData({
    queryKey,
    queryFn: () => {
      return new Fuse(items, {
        keys: keys || ["name"],
        threshold: 0,
        ignoreLocation: true,
      });
    },
  });
};

export const rqSetAndInvalidateQuery = async <T>(
  queryKey: QueryKey,
  newValue: T,
  invalidateKey?: QueryKey
) => {
  queryClient.setQueryData(queryKey, newValue);
  await queryClient.invalidateQueries(invalidateKey || queryKey);
};
