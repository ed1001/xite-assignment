export const rq_tracks_keys = {
  single: "track",
  id: (id: number) => [rq_tracks_keys.single, id] as const,
  all: "tracks",
  list: () => [rq_tracks_keys.all, "list"] as const,
};

export const rq_artists_keys = {
  single: "artist",
  id: (id: number) => [rq_artists_keys.single, id] as const,
  all: "artists",
  list: () => [rq_artists_keys.all, "list"] as const,
};

export const rq_genres_keys = {
  all: "genres",
  list: () => [rq_genres_keys.all, "list"] as const,
};
