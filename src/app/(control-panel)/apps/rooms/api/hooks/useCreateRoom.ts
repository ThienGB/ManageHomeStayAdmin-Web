import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { roomsApi } from '../services/roomsApiService';

export const useCreateRoom = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (data: any) => roomsApi.createRoom(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
			enqueueSnackbar('Room created successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error creating room', { variant: 'error' });
		}
	});
};
