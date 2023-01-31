import { del, get, set } from "idb-keyval";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { DehydrateOptions, QueryKey } from "@tanstack/react-query";
import isEqual from "lodash.isequal";
import debounce from "lodash.debounce";
import { persistedKeys as persistedInspectorKeys } from "./inspector";
import { persistedKeys as persistedPlaylistKeys } from "./playlists";
import { queryClient } from "./client";

export const idbPersistorKey = "REACT_QUERY";

const debouncedSet = debounce(
  (idbValidKey, client) => set(idbValidKey, client),
  300,
  { trailing: true }
);

export const createIDBPersister = (idbValidKey: IDBValidKey) =>
  ({
    persistClient: async (client: PersistedClient) =>
      await debouncedSet(idbValidKey, client),
    restoreClient: async () => await get<PersistedClient>(idbValidKey),
    removeClient: async () => await del(idbValidKey),
  } as Persister);

const persister = createIDBPersister(idbPersistorKey);
const persistQueries: QueryKey[] = [
  ...persistedInspectorKeys,
  ...persistedPlaylistKeys,
];
const dehydrateOptions: DehydrateOptions = {
  shouldDehydrateQuery: ({ queryKey }) => {
    return persistQueries.some((persistQuery) =>
      isEqual(persistQuery, queryKey)
    );
  },
};

export const persistOptions = { persister, dehydrateOptions };

export const clearAllData = async () => {
  await queryClient.clear();
  persister.removeClient();
  window.location.reload();
};
