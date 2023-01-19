import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { queryClient } from "./react-query/hooks";
import { ContentContainer, Navbar, Sidebar } from "./components";
import {
  Artists,
  Dashboard,
  Genres,
  Inspector,
  Playlists,
  Tracks,
} from "./pages";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
