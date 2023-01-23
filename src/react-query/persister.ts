import { del, get, set } from "idb-keyval";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { DehydrateOptions, QueryKey } from "@tanstack/react-query";
import isEqual from "lodash.isequal";
import { persistedKeys as persistedInspectorKeys } from "./inspector";
import { persistedKeys as persistedPlaylistKeys } from "./playlists";

export const idbPersistorKey = "REACT_QUERY";

export const createIDBPersister = (idbValidKey: IDBValidKey) =>
  ({
    persistClient: async (client: PersistedClient) =>
      await set(idbValidKey, client),
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

// Uncomment below and refresh to clear persisted cache
// persister.removeClient();
