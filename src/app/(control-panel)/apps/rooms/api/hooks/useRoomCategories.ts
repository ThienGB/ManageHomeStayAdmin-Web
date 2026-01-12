import { useQuery } from '@tanstack/react-query';
import { attractionsApi } from '../services/attractionsApiService';

export const attractionCategoriesQueryKey = ['attraction-categories'];

export const useAttractionCategories = () => {
	return useQuery({
		queryKey: attractionCategoriesQueryKey,
		queryFn: attractionsApi.getCategories
	});
};
