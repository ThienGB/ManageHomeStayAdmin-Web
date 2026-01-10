import { Pagination } from "@/types";
import { ReactNode, useState } from "react";
import { CategoriesAppContext, CategoriesState } from "./CategoriesAppContext";

export const CategoriesAppContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [pagination, setPagination] = useState<Pagination>({
		page: 1,
		limit: 10,
	});
	const [searchQuery, setSearchQuery] = useState<string>("");
	const value: CategoriesState = {
		pagination,
		setPagination,
		searchQuery,
		setSearchQuery,
	};

	return (
		<CategoriesAppContext.Provider value={value}>
			{children}
		</CategoriesAppContext.Provider>
	);
};
