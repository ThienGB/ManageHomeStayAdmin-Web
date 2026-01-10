import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { Pagination } from '@/types';

export const amenityCategoriesQueryKey = ( pagination?: Pagination, search?: string) => ['amenity-categories', pagination, search];

export const useAmenityCategories = (pagination?: Pagination, search?: string) => {
	return useQuery({
		queryKey: amenityCategoriesQueryKey(pagination, search),
		queryFn: () => amenitiesApi.getCategories(pagination || { page: 1, limit: 100 }, search || '' )
	});
};
