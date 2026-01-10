import { Pagination } from "@/types";
import { createContext } from "react";

export type AmenitiesState = {
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};	

export const AmenitiesAppContext = createContext<AmenitiesState | null>(null);
