import { get, set, del } from "idb-keyval";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

export const idbPersistorKey = "REACT_QUERY";

export const createIDBPersister = (idbValidKey: IDBValidKey) =>
  ({
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister);

export const persister = createIDBPersister(idbPersistorKey);

export const removePersisterClient = () => {
  persister.removeClient();
};

// Uncomment below to clear persisted cache
// removePersisterClient();
