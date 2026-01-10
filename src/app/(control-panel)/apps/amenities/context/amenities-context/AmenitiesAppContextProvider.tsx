import { ReactNode, useState } from "react";
import { AmenitiesAppContext, AmenitiesState } from "./AmenitiesAppContext";
import { Pagination } from "@/types";

export const AmenitiesAppContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const value: AmenitiesState = {
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
  };

  return (
    <AmenitiesAppContext.Provider value={value}>
      {children}
    </AmenitiesAppContext.Provider>
  );
};
