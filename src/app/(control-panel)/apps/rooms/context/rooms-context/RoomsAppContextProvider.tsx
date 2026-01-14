import { Pagination } from "@/types";
import { ReactNode, useState } from "react";
import { RoomsAppContext, RoomsFilters, RoomsState } from "./RoomsAppContext";

const initialFilters: RoomsFilters = {
  search: "",
  city: "",
  amenityIds: [],
  amenityCategoryId: "",
  rating: undefined,
  status: "",
  minPrice: undefined,
  maxPrice: undefined,
};

export const RoomsAppContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState<RoomsFilters>(initialFilters);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const value: RoomsState = {
    pagination,
    setPagination,
    filters,
    setFilters,
    resetFilters,
  };

  return (
    <RoomsAppContext.Provider value={value}>
      {children}
    </RoomsAppContext.Provider>
  );
};
