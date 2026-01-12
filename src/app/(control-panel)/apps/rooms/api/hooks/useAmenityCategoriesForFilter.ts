import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../../../amenities/api/services/amenitiesApiService';

export const useAmenityCategoriesForFilter = (search?: string) => {
	return useQuery({
		queryKey: ['amenity-categories-filter', search],
		queryFn: () => amenitiesApi.getCategories({ page: 1, limit: 100 }, search),
		enabled: true,
	});
};
