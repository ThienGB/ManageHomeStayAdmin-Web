import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attractionsApi } from '../services/attractionsApiService';
import { Attraction } from '../types';
import { useSnackbar } from 'notistack';
import { attractionsQueryKey } from './useAttractions';

export const useCreateAttraction = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (data: Partial<Attraction>) => attractionsApi.createAttraction(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: attractionsQueryKey });
			enqueueSnackbar('Attraction created successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error creating attraction', { variant: 'error' });
		}
	});
};
