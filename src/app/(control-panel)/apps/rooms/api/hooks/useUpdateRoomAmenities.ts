import { getErrorMessage } from '@/utils/errorUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { roomsApi } from '../services/roomsApiService';
import { roomKeys } from './queryKeys';

export const useUpdateRoomAmenities = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({
			roomId,
			amenities
		}: {
			roomId: string;
			amenities: Array<{ amenityId: string; isHighlight: boolean }>;
		}) => roomsApi.updateRoomAmenities(roomId, amenities),
		onSuccess: (_, { roomId }) => {
			// Invalidate room detail to refetch updated amenities
			queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });
			queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
			enqueueSnackbar('Cập nhật tiện nghi thành công', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};
