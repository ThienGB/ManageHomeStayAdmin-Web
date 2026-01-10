import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { Amenity } from '../types';
import { amenitiesQueryKey } from './useAmenities';
import { amenityQueryKey } from './useAmenity';
import { useSnackbar } from 'notistack';

type UseUpdateAmenityOptions = {
	showToast?: boolean;
};

export const useUpdateAmenity = (options: UseUpdateAmenityOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (amenity: Amenity) => amenitiesApi.updateAmenity(amenity),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['amenities'] });
			queryClient.invalidateQueries({ queryKey: amenityQueryKey(data.id) });
			if (showToast) {
				enqueueSnackbar('Amenity updated successfully', { variant: 'success' });
			}
		},
		onError: () => {
			if (showToast) {
				enqueueSnackbar('Error updating amenity', { variant: 'error' });
			}
		}
	});
};
