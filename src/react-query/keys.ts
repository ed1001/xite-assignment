export const rq_tracks_keys = {
  single: ["track"] as const,
  id: (id: number) => [...rq_tracks_keys.single, id] as const,
  all: ["tracks"] as const,
  list: (searchTerm?: string) =>
    [...rq_tracks_keys.all, "list", searchTerm] as const,
  infiniteList: (searchTerm?: string) =>
    [...rq_tracks_keys.all, "infinite", "list", searchTerm] as const,
};

export const rq_artists_keys = {
  single: ["artist"] as const,
  id: (id: number) => [...rq_artists_keys.single, id] as const,
  all: ["artists"] as const,
  list: () => [...rq_artists_keys.all, "list"] as const,
  infiniteList: () => [...rq_artists_keys.all, "infinite", "list"] as const,
};

export const rq_genres_keys = {
  all: ["genres"] as const,
  list: () => [...rq_genres_keys.all, "list"] as const,
};
