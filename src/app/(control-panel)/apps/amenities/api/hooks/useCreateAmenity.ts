import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenitiesApi } from '../services/amenitiesApiService';
import { Amenity } from '../types';
import { amenitiesQueryKey } from './useAmenities';
import useNavigate from '@fuse/hooks/useNavigate';
import { useSnackbar } from 'notistack';

type UseCreateAmenityOptions = {
	showToast?: boolean;
};

export const useCreateAmenity = (options: UseCreateAmenityOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (amenity: Partial<Amenity>) => amenitiesApi.createAmenity(amenity),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['amenities'] });
			if (showToast) {
				enqueueSnackbar('Amenity created successfully', { variant: 'success' });
			}
			navigate(`/apps/amenities/${data.id}`);
		},
		onError: () => {
			if (showToast) {
				enqueueSnackbar('Error creating amenity', { variant: 'error' });
			}
		}
	});
};
