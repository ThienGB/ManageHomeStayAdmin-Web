import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { roomsApi } from '../services/roomsApiService';

export const useDeleteRoom = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (roomId: string) => roomsApi.deleteRoom(roomId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
			enqueueSnackbar('Room deleted successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error deleting room', { variant: 'error' });
		}
	});
};
