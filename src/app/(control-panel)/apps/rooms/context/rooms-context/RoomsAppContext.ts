import { Pagination } from "@/types";
import { createContext } from "react";

export type AttractionsFilters = {
  search?: string;
  city?: string;
  amenityIds?: string[];
  amenityCategoryId?: string;
  rating?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type AttractionsState = {
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  filters: AttractionsFilters;
  setFilters: (filters: AttractionsFilters) => void;
  resetFilters: () => void;
};

export const AttractionsAppContext = createContext<AttractionsState | null>(null);
