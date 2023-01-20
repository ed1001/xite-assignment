import { queryClient } from "./client";
import { QueryKey } from "@tanstack/query-core/src/types";

export const DEFAULT_PAGE_LIMIT = 15;

// Reset the previously searched query to the first page when a new search is made
export const trimPreviousInfiniteQuery = (queryKey: QueryKey) => {
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
