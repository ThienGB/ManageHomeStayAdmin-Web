import { ReactNode, useState } from "react";
import { AttractionsAppContext, AttractionsState, AttractionsFilters } from "./AttractionsAppContext";
import { Pagination } from "@/types";

const initialFilters: AttractionsFilters = {
  search: "",
  city: "",
  amenityIds: [],
  amenityCategoryId: "",
  rating: undefined,
  status: "",
  minPrice: undefined,
  maxPrice: undefined,
};

export const AttractionsAppContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState<AttractionsFilters>(initialFilters);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const value: AttractionsState = {
    pagination,
    setPagination,
    filters,
    setFilters,
    resetFilters,
  };

  return (
    <AttractionsAppContext.Provider value={value}>
      {children}
    </AttractionsAppContext.Provider>
  );
};
