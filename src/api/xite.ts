import { Track } from "../types";

export const TRACKS_ENDPOINT_URL =
  "https://d.xite.com/assignment/metadata.json";

export const getTracks = async (): Promise<Track[]> => {
  try {
    const res = await fetch(TRACKS_ENDPOINT_URL);

    const tracksUnsorted: Track[] = await res.json();
    const tracks = tracksUnsorted.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (dateA === dateB) {
        return 0;
      }

      return dateA > dateB ? -1 : 1;
    });

    return tracks;
  } catch (err) {
    return [];
  }
};
