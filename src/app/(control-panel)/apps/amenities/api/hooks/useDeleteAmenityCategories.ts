import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { amenityCategoriesQueryKey } from './useAmenityCategories';
import { useSnackbar } from 'notistack';

type UseDeleteAmenityCategoriesOptions = {
	showToast?: boolean;
};

export const useDeleteAmenityCategories = (options: UseDeleteAmenityCategoriesOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (ids: string[]) => amenitiesApi.deleteCategories(ids),
		onSuccess: (_, ids) => {
			queryClient.invalidateQueries({ queryKey: amenityCategoriesQueryKey() });
			if (showToast) {
				enqueueSnackbar(`${ids.length} ${ids.length === 1 ? 'category' : 'categories'} deleted successfully`, { variant: 'success' });
			}
		},
		onError: () => {
			if (showToast) {
				enqueueSnackbar('Error deleting categories', { variant: 'error' });
			}
		}
	});
};
