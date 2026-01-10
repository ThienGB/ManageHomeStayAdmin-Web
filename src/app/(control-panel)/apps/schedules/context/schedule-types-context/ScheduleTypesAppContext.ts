import { Pagination } from '@/types';
import { createContext } from 'react';

export type ScheduleTypesState = {
	pagination: Pagination;
	setPagination: (pagination: Pagination) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
};

export const ScheduleTypesAppContext = createContext<ScheduleTypesState | null>(null);
