import { Pagination } from "@/types";
import { createContext } from "react";

export type CategoriesState = {
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};	

export const CategoriesAppContext = createContext<CategoriesState | null>(null);
