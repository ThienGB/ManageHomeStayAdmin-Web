import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../../../amenities/api/services/amenitiesApiService';

export const useAmenities = (search?: string, categoryId?: string) => {
	return useQuery({
		queryKey: ['amenities-filter', search, categoryId],
		queryFn: () => amenitiesApi.getAmenities(),
		enabled: true,
	});
};
