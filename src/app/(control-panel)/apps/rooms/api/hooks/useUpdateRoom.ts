import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { roomsApi } from '../services/roomsApiService';
import { Room } from '../types';
import { roomQueryKey } from './useRoom';

export const useUpdateRoom = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ roomId, data }: { roomId: string; data: Partial<Room> }) =>
			roomsApi.updateRoom(roomId, data),
		onSuccess: (_, { roomId }) => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
			queryClient.invalidateQueries({ queryKey: roomQueryKey(roomId) });
			enqueueSnackbar('Room updated successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error updating room', { variant: 'error' });
		}
	});
};
