import { Pagination } from "@/types";
import { createContext } from "react";

export type RoomsFilters = {
  search?: string;
  city?: string;
  amenityIds?: string[];
  amenityCategoryId?: string;
  rating?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type RoomsState = {
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  filters: RoomsFilters;
  setFilters: (filters: RoomsFilters) => void;
  resetFilters: () => void;
};

export const RoomsAppContext = createContext<RoomsState | null>(null);
