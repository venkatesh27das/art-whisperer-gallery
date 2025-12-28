export interface Painting {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  dimensions: string;
  medium: string;
  year: number;
  createdAt: Date;
}

export type PaintingCategory = 
  | "Abstract"
  | "Landscape"
  | "Portrait"
  | "Still Life"
  | "Contemporary"
  | "Classical"
  | "Modern"
  | "Impressionist";

export const CATEGORIES: PaintingCategory[] = [
  "Abstract",
  "Landscape",
  "Portrait",
  "Still Life",
  "Contemporary",
  "Classical",
  "Modern",
  "Impressionist",
];

export type SortOption = "price-asc" | "price-desc" | "newest" | "oldest" | "name";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];
