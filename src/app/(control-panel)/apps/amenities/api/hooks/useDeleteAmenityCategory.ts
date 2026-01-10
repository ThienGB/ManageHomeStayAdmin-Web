import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { amenityCategoriesQueryKey } from './useAmenityCategories';
import { Pagination } from '@/types';
import { useSnackbar } from 'notistack';

type UseDeleteAmenityCategoryOptions = {
	showToast?: boolean;
};

export const useDeleteAmenityCategory = (pagination?: Pagination, options: UseDeleteAmenityCategoryOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (id: string) => amenitiesApi.deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: amenityCategoriesQueryKey(pagination) });
			if (showToast) {
				enqueueSnackbar('Category deleted successfully', { variant: 'success' });
			}
		},
		onError: () => {
			if (showToast) {
				enqueueSnackbar('Error deleting category', { variant: 'error' });
			}
		}
	});
};
