import { PropsWithChildren } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useTrack, useTracks } from "../tracks";
import { useArtist, useArtists } from "../artists";
import { useGenres } from "../genres";
import mockTrackList from "./mock-tracks.json";
import mockArtistList from "./mock-artists.json";
import mockGenreList from "./mock-genres.json";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  // @ts-ignore
  jest.spyOn(global, "fetch").mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockTrackList),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
describe("react query", () => {
  // TRACKS
  describe("tracks", () => {
    describe("useTracks", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useTracks(), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockTrackList);
      });
    });

    describe("useTrack", () => {
      const expectedTrackId = 514;
      const expectedTrack = mockTrackList.find(
        (track) => track.id === expectedTrackId
      );

      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useTrack(expectedTrackId), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(expectedTrack);
      });
    });
  });

  // ARTISTS
  describe("artists", () => {
    describe("useArtists", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useArtists(), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockArtistList);
      });
    });

    describe("useArtist", () => {
      const expectedArtistId = 5447758;
      const expectedArtist = mockArtistList.find(
        (artist) => artist.id === expectedArtistId
      );

      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useArtist(expectedArtistId), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(expectedArtist);
      });
    });
  });

  // GENRES
  describe("genres", () => {
    describe("useGenres", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useGenres(), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockGenreList);
      });
    });
  });
});
