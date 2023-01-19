import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { queryClient } from "./react-query/hooks";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ContentContainer from "./components/ContentContainer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<div>dashboard</div>} />
            <Route path="/tracks" element={<div>tracks</div>} />
            <Route path="/artists" element={<div>artists</div>} />
            <Route path="/genres" element={<div>genres</div>} />
            <Route path="/playlists" element={<div>playlists</div>} />
            <Route path="*" element={<div>not found</div>} />
          </Routes>
        </ContentContainer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
