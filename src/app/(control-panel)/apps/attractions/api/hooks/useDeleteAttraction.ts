import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attractionsApi } from '../services/attractionsApiService';
import { useSnackbar } from 'notistack';
import { attractionsQueryKey } from './useAttractions';

export const useDeleteAttraction = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (attractionId: string) => attractionsApi.deleteAttraction(attractionId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: attractionsQueryKey });
			enqueueSnackbar('Attraction deleted successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error deleting attraction', { variant: 'error' });
		}
	});
};
