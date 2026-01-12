import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../../../amenities/api/services/amenitiesApiService';

export const useAmenitiesForFilter = (search?: string, categoryId?: string) => {
	return useQuery({
		queryKey: ['amenities-filter', search, categoryId],
		queryFn: () => amenitiesApi.getAmenities({ page: 1, limit: 100 }, search, categoryId),
		enabled: true,
	});
};
