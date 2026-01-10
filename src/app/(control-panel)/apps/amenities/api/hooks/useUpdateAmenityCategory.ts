import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { AmenityCategory } from '../types';
import { amenityCategoriesQueryKey } from './useAmenityCategories';
import { Pagination } from '@/types';
import { useSnackbar } from 'notistack';

type UseUpdateAmenityCategoryOptions = {
	showToast?: boolean;
};

export const useUpdateAmenityCategory = (pagination: Pagination, options: UseUpdateAmenityCategoryOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (category: AmenityCategory) => amenitiesApi.updateCategory(category),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: amenityCategoriesQueryKey(pagination) });
			if (showToast) {
				enqueueSnackbar('Category updated successfully', { variant: 'success' });
			}
		},
		onError: () => {
			if (showToast) {
				enqueueSnackbar('Error updating category', { variant: 'error' });
			}
		}
	});
};
