import { useQuery } from '@tanstack/react-query';

import { scheduleTypesApi } from '../services/ScheduleTypesAPIServices';
import { Pagination } from '@/types';

export const useScheduleTypes = (pagination: Pagination, search?: string) => {
	return useQuery({
		queryKey: ['scheduleTypes', pagination, search],
		queryFn: () => scheduleTypesApi.getScheduleTypes(pagination, search)
	});
};
