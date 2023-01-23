import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./client";

/************
 * QUERY KEYS
 ************/

export const rq_dropdown_keys = {
  all: ["dropdown"] as const,
  openId: () => [...rq_dropdown_keys.all, "openId"] as const,
};

/*******
 * HOOKS
 *******/

export const useDropdownOpenId = () => {
  return useQuery<string | undefined>({
    queryKey: rq_dropdown_keys.openId(),
    queryFn: async () => queryClient.getQueryData(rq_dropdown_keys.openId()),
    initialData: "",
  });
};

export const useSetDropdownOpenId = () => {
  return useMutation({
    mutationFn: async (dropdownId: string) => {
      queryClient.setQueryData(rq_dropdown_keys.openId(), dropdownId);
    },
  });
};
