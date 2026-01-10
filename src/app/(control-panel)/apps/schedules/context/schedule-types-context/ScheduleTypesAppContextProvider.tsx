import { ScheduleTypesAppContext, ScheduleTypesState } from './ScheduleTypesAppContext';
import { ReactNode, useState } from 'react';
import { Pagination } from '@/types';

export const ScheduleTypesAppContextProvider = ({ children }: { children: ReactNode }) => {
	const [pagination, setPagination] = useState<Pagination>({
		page: 1,
		limit: 10
	});
	const [searchQuery, setSearchQuery] = useState<string>('');

	const value: ScheduleTypesState = {
		pagination,
		setPagination,
		searchQuery,
		setSearchQuery
	};

	return <ScheduleTypesAppContext.Provider value={value}>{children}</ScheduleTypesAppContext.Provider>;
};
