import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { amenitiesQueryKey } from './useAmenities';
import { Pagination } from '@/types';
import { useSnackbar } from 'notistack';

type UseDeleteAmenityOptions = {
	showToast?: boolean;
};

export const useDeleteAmenity = (pagination?: Pagination, options: UseDeleteAmenityOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (id: string) => amenitiesApi.deleteAmenity(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: amenitiesQueryKey(pagination) });
			if (showToast) {
				enqueueSnackbar('Amenity deleted successfully', { variant: 'success' });
			}
		},
		onError: () => {
			if (showToast) {
				enqueueSnackbar('Error deleting amenity', { variant: 'error' });
			}
		}
	});
};
