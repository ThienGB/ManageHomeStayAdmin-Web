import { useQuery } from '@tanstack/react-query';
import { attractionsApi, GetAttractionsParams } from '../services/attractionsApiService';

export const attractionsQueryKey = (params: GetAttractionsParams) => ['attractions', params];

export const useAttractions = (params: GetAttractionsParams) => {
	return useQuery({
		queryKey: attractionsQueryKey(params),
		queryFn: () => attractionsApi.getAttractions(params)
	});
};
