import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../../../amenities/api/services/amenitiesApiService';
import { amenityKeys } from './queryKeys';

export const useAmenities = (search?: string) => {
	return useQuery({
		queryKey: amenityKeys.list(search),
		queryFn: () => amenitiesApi.getAmenities()
	});
};
