import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { Pagination } from '@/types';

export const amenitiesQueryKey = (pagination?: Pagination, search?: string, categoryId?: string) => ['amenities', pagination, search, categoryId];

export const useAmenities = (pagination?: Pagination, search?: string, categoryId?: string) => {
	return useQuery({
		queryKey: amenitiesQueryKey(pagination, search, categoryId),
		queryFn: () => amenitiesApi.getAmenities(pagination, search, categoryId)
	});
};
