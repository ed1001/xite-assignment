import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { queryClient } from "./react-query/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistOptions } from "./react-query/persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ContentContainer, Navbar, Sidebar } from "./components";
import { prefetchAllTracks } from "./react-query/tracks";
import {
  Artists,
  Dashboard,
  Genres,
  Inspector,
  Playlists,
  Tracks,
} from "./pages";

function App() {
  useEffect(() => {
    prefetchAllTracks().catch((err) =>
      console.warn("Could not prefetch track data", err)
    );
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="*" element={<div>not found</div>} />
          </Routes>
          <Inspector />
        </ContentContainer>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}

export default App;
