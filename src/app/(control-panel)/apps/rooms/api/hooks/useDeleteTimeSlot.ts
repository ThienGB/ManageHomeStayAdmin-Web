import { getErrorMessage } from '@/utils/errorUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { timeslotsApi } from '../services/timeslotApiService';
import { roomKeys } from './queryKeys';

export const useDeleteTimeSlot = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ timeslotId, roomId }: { timeslotId: string; roomId: string }) =>
			timeslotsApi.deleteTimeSlot(roomId, timeslotId),
		onSuccess: (_, { roomId, timeslotId }) => {
			// Invalidate timeslots list
			queryClient.invalidateQueries({ queryKey: roomKeys.timeslots(roomId) });
			// Remove the specific timeslot from cache
			queryClient.removeQueries({ queryKey: roomKeys.timeslot(roomId, timeslotId) });
			enqueueSnackbar('Xóa khung giờ thành công', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};
