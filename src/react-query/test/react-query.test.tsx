import { PropsWithChildren } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInfiniteTracks, useTrack } from "../tracks";
import { useArtist, useInfiniteArtists } from "../artists";
import mockTrackList from "./mock-tracks.json";
import expectedTracksSearch from "./expected-tracks-search.json";
import mockArtistList from "./mock-artists.json";
import mockGenreList from "./mock-genres.json";
import mockPlaylistList from "./mock-playlists.json";
import { useGenre, useInfiniteGenres } from "../genres";
import {
  useCreatePlaylist,
  useInfinitePlaylists,
  usePlaylist,
} from "../playlists";
import {
  useAddToInspector,
  useInspectedItems,
  useRemoveFromInspector,
} from "../inspector";
import { InspectableItem } from "../../types";

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

const expectedTrackId = 514;

afterEach(() => {
  jest.restoreAllMocks();
});
describe("react query", () => {
  // TRACKS
  describe("tracks", () => {
    describe("useInfiniteTracks", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useInfiniteTracks("", 2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].tracks).toEqual(
          mockTrackList.slice(0, 2)
        );
      });

      test("succeeds and retrieves correct data with search term", async () => {
        const { result } = renderHook(() => useInfiniteTracks("mar", 2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].tracks).toEqual(
          expectedTracksSearch
        );
      });
    });

    describe("useTrack", () => {
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
    describe("useInfiniteArtists", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useInfiniteArtists("", 2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].artists).toEqual(
          mockArtistList.slice(0, 2)
        );
      });

      test("succeeds and retrieves correct data with search term", async () => {
        const expected = [
          {
            id: 5203174,
            name: "Alison Krauss",
          },
          {
            id: 5406098,
            name: "Alison Krauss & Union Station",
          },
        ];

        const { result } = renderHook(() => useInfiniteArtists("alison", 2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].artists).toEqual(expected);
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
    describe("useInfiniteGenres", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useInfiniteGenres("", 2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].genres).toEqual(
          mockGenreList.slice(0, 2)
        );
      });

      test("succeeds and retrieves correct data with search term", async () => {
        const expected = [
          {
            name: "Alternative/Indie",
            id: 2,
            type: "Genre",
          },
          {
            name: "Alternative/Indie",
            id: 8,
            type: "Sub genre",
          },
        ];
        const { result } = renderHook(
          () => useInfiniteGenres("alternative", 2),
          {
            wrapper,
          }
        );
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].genres).toEqual(expected);
      });
    });

    describe("useGenre", () => {
      test("succeeds and retrieves correct data", async () => {
        const expected = {
          name: "Alternative/Indie",
          id: 2,
          type: "Genre",
        };

        const { result } = renderHook(() => useGenre(2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(expected);
      });
    });
  });

  // PLAYLISTS
  describe("playlists", () => {
    const expected = mockPlaylistList
      .slice(0, 2)
      .map(({ id, name }) => ({ id, name }));

    describe("useCreatePlaylist", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useCreatePlaylist(), {
          wrapper,
        });

        act(() => {
          result.current.mutate({ trackId: expectedTrackId });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        act(() => {
          result.current.mutate({ trackId: expectedTrackId });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
      });
    });

    describe("useInfinitePlaylists", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useInfinitePlaylists("", 2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].playlists.length).toEqual(2);
        expect(result.current.data?.pages[0].playlists).toEqual(
          expect.arrayContaining(
            expected.map((partialPlaylist) =>
              expect.objectContaining(partialPlaylist)
            )
          )
        );
      });

      test("succeeds and retrieves correct data with search term", async () => {
        const { result } = renderHook(
          () => useInfinitePlaylists("Untitled Playlist 2", 2),
          {
            wrapper,
          }
        );
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.pages.length).toEqual(1);
        expect(result.current.data?.pages[0].playlists.length).toEqual(1);
        expect(result.current.data?.pages[0].playlists).toEqual(
          expect.arrayContaining([expect.objectContaining(expected[0])])
        );
      });
    });

    describe("usePlaylist", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => usePlaylist(2), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(
          expect.objectContaining(expected[0])
        );
      });
    });
  });

  // INSPECTOR
  describe("inspector", () => {
    const expected: InspectableItem[] = [
      {
        type: "track",
        id: expectedTrackId,
        displayName: "Mariachi Flow",
      },
      {
        type: "playlist",
        id: 2,
        displayName: "Untitled Playlist 2",
      },
      {
        type: "artist",
        id: 5672552,
        displayName: "Golden Features",
      },
    ];

    describe("useAddToInspector", () => {
      test("succeeds and adds the correct data", async () => {
        const { result } = renderHook(() => useAddToInspector(), {
          wrapper,
        });

        act(() => {
          result.current.mutate(expected[0]);
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        act(() => {
          result.current.mutate(expected[1]);
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        act(() => {
          result.current.mutate(expected[2]);
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
      });
    });

    describe("useInspectedItems", () => {
      test("succeeds and retrieves correct data", async () => {
        const { result } = renderHook(() => useInspectedItems(), {
          wrapper,
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(expected);
      });
    });

    describe("useRemoveFromInspector", () => {
      test("succeeds and adds the correct data", async () => {
        const { result } = renderHook(() => useRemoveFromInspector(), {
          wrapper,
        });

        act(() => {
          result.current.mutate({ id: expected[2].id, type: expected[2].type });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
      });
    });
  });
});
