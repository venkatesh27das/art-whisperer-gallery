import React, { createContext, useContext, useState, ReactNode } from "react";
import { Painting } from "@/types/painting";
import { mockPaintings } from "@/data/mockPaintings";

interface GalleryContextType {
  paintings: Painting[];
  addPainting: (painting: Omit<Painting, "id" | "createdAt">) => void;
  updatePainting: (id: string, painting: Partial<Painting>) => void;
  deletePainting: (id: string) => void;
  getPainting: (id: string) => Painting | undefined;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paintings, setPaintings] = useState<Painting[]>(mockPaintings);

  const addPainting = (painting: Omit<Painting, "id" | "createdAt">) => {
    const newPainting: Painting = {
      ...painting,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setPaintings((prev) => [newPainting, ...prev]);
  };

  const updatePainting = (id: string, updates: Partial<Painting>) => {
    setPaintings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePainting = (id: string) => {
    setPaintings((prev) => prev.filter((p) => p.id !== id));
  };

  const getPainting = (id: string) => {
    return paintings.find((p) => p.id === id);
  };

  return (
    <GalleryContext.Provider
      value={{ paintings, addPainting, updatePainting, deletePainting, getPainting }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
};
