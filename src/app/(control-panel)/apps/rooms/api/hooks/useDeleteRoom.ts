import { getErrorMessage } from '@/utils/errorUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { roomsApi } from '../services/roomsApiService';
import { roomKeys } from './queryKeys';

export const useDeleteRoom = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (roomId: string) => roomsApi.deleteRoom(roomId),
		onSuccess: (_, roomId) => {
			// Invalidate all room queries (lists and the specific room)
			queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
			// Remove the specific room from cache
			queryClient.removeQueries({ queryKey: roomKeys.detail(roomId) });
			enqueueSnackbar('Xóa phòng thành công', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};
