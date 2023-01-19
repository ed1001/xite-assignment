import { Track } from "../types";

export const TRACKS_ENDPOINT_URL =
  "https://d.xite.com/assignment/metadata.json";

export const getTracks = async (): Promise<Track[]> => {
  try {
    const res = await fetch(TRACKS_ENDPOINT_URL);

    return await res.json();
  } catch (err) {
    // TODO handle error
    return [];
  }
};
