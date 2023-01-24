import { useMutation, useQuery } from "@tanstack/react-query";
import { InspectableItem, InspectedItems } from "../types";
import { queryClient } from "./client";
import { rqSetAndInvalidateQuery } from "./util";

/************
 * QUERY KEYS
 ************/

export const rq_inspector_keys = {
  all: ["inspector"] as const,
  inspectedItems: () => [...rq_inspector_keys.all, "inspectedItems"] as const,
  currentItemIndex: () =>
    [...rq_inspector_keys.all, "currentInspectorItemIndex"] as const,
  open: () => [...rq_inspector_keys.all, "open"] as const,
};

const { currentItemIndex, open, inspectedItems } = rq_inspector_keys;
export const persistedKeys = [currentItemIndex(), open(), inspectedItems()];

/*******
 * HOOKS
 *******/

export const useInspectorOpen = () => {
  return useQuery<boolean>({
    queryKey: rq_inspector_keys.open(),
    queryFn: async () => !!queryClient.getQueryData(rq_inspector_keys.open()),
  });
};

export const useInspectedItems = () => {
  return useQuery<InspectedItems>({
    queryKey: rq_inspector_keys.inspectedItems(),
    queryFn: rqGetInspectedItems,
  });
};

export const useAddToInspector = () => {
  return useMutation({
    mutationFn: rqAddToInspectedItems,
  });
};

export const useRemoveFromInspector = () => {
  return useMutation({
    mutationFn: async (item: InspectableItem) => {
      const newInspectedItems =
        queryClient.setQueryData(
          rq_inspector_keys.inspectedItems(),
          (prev: InspectedItems | undefined) => {
            return prev?.filter(
              (inspectedItem) =>
                inspectedItem.type !== item.type || inspectedItem.id !== item.id
            );
          }
        ) || [];

      if (!newInspectedItems.length) {
        return rqSetCurrentInspectorItemIndex(-1);
      }

      const currentIndex = await rqGetCurrentInspectorItemIndex();
      const newIndex = newInspectedItems[currentIndex]
        ? currentIndex
        : currentIndex - 1;

      rqSetCurrentInspectorItemIndex(newIndex);
    },
  });
};

export const useCurrentInspectorItemIndex = () => {
  return useQuery<number>({
    queryKey: rq_inspector_keys.currentItemIndex(),
    queryFn: rqGetCurrentInspectorItemIndex,
  });
};

/******************
 * HELPER FUNCTIONS
 ******************/

const rqGetInspectedItems = async (): Promise<InspectedItems> =>
  queryClient.getQueryData(rq_inspector_keys.inspectedItems()) || [];

export const rqGetCurrentInspectorItemIndex = async (): Promise<number> =>
  queryClient.getQueryData(rq_inspector_keys.currentItemIndex()) ?? -1;

export const rqSetCurrentInspectorItemIndex = (inspecting: number) =>
  queryClient.setQueryData(rq_inspector_keys.currentItemIndex(), inspecting);

export const rqAddToInspectedItems = async (item: InspectableItem) => {
  const inspected = await rqGetInspectedItems();
  const existingItemIndex = getIndexOfInspectedItem(inspected, item);

  let newCurrentInspectorItemIndex = existingItemIndex;

  if (existingItemIndex === -1) {
    queryClient.setQueryData(
      rq_inspector_keys.inspectedItems(),
      (prev: InspectedItems | undefined) => {
        return [...(prev || []), item];
      }
    );

    newCurrentInspectorItemIndex = inspected.length;
  }

  rqSetCurrentInspectorItemIndex(newCurrentInspectorItemIndex);
  queryClient.setQueryData(rq_inspector_keys.open(), true);
};

export const rqUpdateInspectedItem = async (
  id: number,
  updatedItem: InspectableItem
) => {
  const inspectedItems = await rqGetInspectedItems();
  const updatedItems = inspectedItems.map((item) => {
    if (item.id === updatedItem.id) {
      return updatedItem;
    }

    return item;
  });

  await rqSetAndInvalidateQuery<InspectableItem[]>(
    rq_inspector_keys.inspectedItems(),
    updatedItems,
    rq_inspector_keys.all
  );
};

export const rqToggleInspecterOpen = () =>
  queryClient.setQueryData(rq_inspector_keys.open(), (prev) => !prev);

const getIndexOfInspectedItem = (
  inspected: InspectedItems,
  item: InspectableItem
) =>
  inspected.findIndex(
    (inspectedItem) =>
      inspectedItem.type === item.type && inspectedItem.id === item.id
  );
