import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Painting } from "@/types/painting";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GalleryContextType {
  paintings: Painting[];
  loading: boolean;
  addPainting: (painting: Omit<Painting, "id" | "createdAt">) => Promise<void>;
  updatePainting: (id: string, painting: Partial<Painting>) => Promise<void>;
  deletePainting: (id: string) => Promise<void>;
  getPainting: (id: string) => Painting | undefined;
  refreshPaintings: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaintings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("paintings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedPaintings: Painting[] = (data || []).map((p) => ({
        id: p.id,
        title: p.title,
        artist: p.artist,
        description: p.description || "",
        price: Number(p.price),
        category: p.category,
        imageUrl: p.image_url || "",
        available: p.available,
        dimensions: p.dimensions || "",
        medium: p.medium || "",
        year: p.year || new Date().getFullYear(),
        createdAt: new Date(p.created_at),
      }));

      setPaintings(formattedPaintings);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching paintings:", error);
      }
      toast.error("Failed to load paintings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  const addPainting = async (painting: Omit<Painting, "id" | "createdAt">) => {
    try {
      const { error } = await supabase.from("paintings").insert({
        title: painting.title,
        artist: painting.artist,
        description: painting.description,
        price: painting.price,
        category: painting.category,
        image_url: painting.imageUrl,
        available: painting.available,
        dimensions: painting.dimensions,
        medium: painting.medium,
        year: painting.year,
      });

      if (error) throw error;

      await fetchPaintings();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error adding painting:", error);
      }
      throw error;
    }
  };

  const updatePainting = async (id: string, updates: Partial<Painting>) => {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.artist !== undefined) updateData.artist = updates.artist;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.available !== undefined) updateData.available = updates.available;
      if (updates.dimensions !== undefined) updateData.dimensions = updates.dimensions;
      if (updates.medium !== undefined) updateData.medium = updates.medium;
      if (updates.year !== undefined) updateData.year = updates.year;

      const { error } = await supabase
        .from("paintings")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      await fetchPaintings();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error updating painting:", error);
      }
      throw error;
    }
  };

  const deletePainting = async (id: string) => {
    try {
      const { error } = await supabase
        .from("paintings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchPaintings();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error deleting painting:", error);
      }
      throw error;
    }
  };

  const getPainting = (id: string) => {
    return paintings.find((p) => p.id === id);
  };

  const refreshPaintings = async () => {
    await fetchPaintings();
  };

  return (
    <GalleryContext.Provider
      value={{
        paintings,
        loading,
        addPainting,
        updatePainting,
        deletePainting,
        getPainting,
        refreshPaintings,
      }}
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
