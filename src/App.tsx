import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { queryClient } from "./react-query/client";
import { persistOptions } from "./react-query/persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { prefetchAllTracks } from "./react-query/tracks";
import { ContentContainer, ErrorBoundary, Navbar, Sidebar } from "./components";
import { Artists, Genres, Inspector, Playlists, Tracks } from "./pages";

function App() {
  useEffect(() => {
    prefetchAllTracks().catch((err) =>
      console.error("Could not prefetch track data", err)
    );
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar />
          <Sidebar />
          <ContentContainer>
            <Routes>
              <Route path="/tracks" element={<Tracks />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="*" element={<Navigate to="/tracks" replace />} />
            </Routes>
            <Inspector />
          </ContentContainer>
        </ErrorBoundary>
      </BrowserRouter>
    </PersistQueryClientProvider>
  );
}

export default App;
