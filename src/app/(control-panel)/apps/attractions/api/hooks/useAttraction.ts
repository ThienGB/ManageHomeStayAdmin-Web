import { useQuery } from '@tanstack/react-query';
import { attractionsApi } from '../services/attractionsApiService';

export const attractionQueryKey = (attractionId: string) => ['attractions', attractionId];

export const useAttraction = (attractionId: string) => {
	return useQuery({
		queryKey: attractionQueryKey(attractionId),
		queryFn: () => attractionsApi.getAttraction(attractionId),
		enabled: Boolean(attractionId)
	});
};
