"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface MediaContextType {
  hoveredId: string | null;
  expandedId: string | null;
  setHoveredId: (id: string | null) => void;
  setExpandedId: (id: string | null) => void;
}

const MediaContext = createContext<MediaContextType | null>(null);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <MediaContext.Provider value={{ hoveredId, expandedId, setHoveredId, setExpandedId }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
}
