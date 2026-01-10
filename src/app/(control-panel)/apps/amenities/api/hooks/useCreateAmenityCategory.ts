import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { AmenityCategory } from '../types';
import { amenityCategoriesQueryKey } from './useAmenityCategories';
import { Pagination } from '@/types';
import { useSnackbar } from 'notistack';

type UseCreateAmenityCategoryOptions = {
	showToast?: boolean;
};

export const useCreateAmenityCategory = (pagination?: Pagination, options: UseCreateAmenityCategoryOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (category: Partial<AmenityCategory>) => amenitiesApi.createCategory(category),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: amenityCategoriesQueryKey(pagination) });
			if (showToast) {
				enqueueSnackbar('Category created successfully', { variant: 'success' });
			}
		},	
		onError: () => {
			if (showToast) {
				enqueueSnackbar('Error creating category', { variant: 'error' });
			}
		}
	});
};
