import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attractionsApi } from '../services/attractionsApiService';
import { Attraction } from '../types';
import { useSnackbar } from 'notistack';
import { attractionsQueryKey } from './useAttractions';
import { attractionQueryKey } from './useAttraction';

export const useUpdateAttraction = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ attractionId, data }: { attractionId: string; data: Partial<Attraction> }) =>
			attractionsApi.updateAttraction(attractionId, data),
		onSuccess: (_, { attractionId }) => {
			queryClient.invalidateQueries({ queryKey: attractionsQueryKey });
			queryClient.invalidateQueries({ queryKey: attractionQueryKey(attractionId) });
			enqueueSnackbar('Attraction updated successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error updating attraction', { variant: 'error' });
		}
	});
};
