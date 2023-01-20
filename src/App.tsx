import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister, idbPersistorKey } from "./react-query/persister";
import { queryClient } from "./react-query/hooks";
import { ContentContainer, Navbar, Sidebar } from "./components";
import { prefetchAllTracks } from "./react-query/helpers";
import {
  Artists,
  Dashboard,
  Genres,
  Inspector,
  Playlists,
  Tracks,
} from "./pages";

const persister = createIDBPersister(idbPersistorKey);

function App() {
  useEffect(() => {
    prefetchAllTracks().catch((err) =>
      console.warn("Could not prefetch track data", err)
    );
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
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
    </PersistQueryClientProvider>
  );
}

export default App;
