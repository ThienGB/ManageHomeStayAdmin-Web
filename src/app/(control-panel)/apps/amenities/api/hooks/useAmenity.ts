import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';

export const amenityQueryKey = (amenityId: string) => ['amenities', amenityId];

export const useAmenity = (amenityId: string) => {
	return useQuery({
		queryKey: amenityQueryKey(amenityId),
		queryFn: () => amenitiesApi.getAmenity(amenityId),
		enabled: Boolean(amenityId) && amenityId !== 'new'
	});
};
