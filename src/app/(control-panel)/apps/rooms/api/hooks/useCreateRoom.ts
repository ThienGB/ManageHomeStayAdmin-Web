import { getErrorMessage } from '@/utils/errorUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { roomsApi } from '../services/roomsApiService';
import { roomKeys } from './queryKeys';

export const useCreateRoom = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (data: any) => roomsApi.createRoom(data),
		onSuccess: () => {
			// Invalidate all room lists to refresh
			queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
			enqueueSnackbar('Thêm phòng thành công', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};
