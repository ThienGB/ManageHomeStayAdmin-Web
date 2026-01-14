import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';

export const amenitiesQueryKey = (search?: string) => ['amenities', search];

export const useAmenities = (search?: string) => {
	return useQuery({
		queryKey: amenitiesQueryKey(search),
		queryFn: () => amenitiesApi.getAmenities()
	});
};
