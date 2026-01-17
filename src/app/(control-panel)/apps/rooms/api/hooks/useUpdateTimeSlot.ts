import { getErrorMessage } from '@/utils/errorUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { timeslotsApi } from '../services/timeslotApiService';
import { TimeSlot } from '../types';
import { roomKeys } from './queryKeys';

export const useUpdateTimeSlot = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ timeslotId, roomId, data }: { timeslotId: string; roomId: string; data: Partial<TimeSlot> }) =>
			timeslotsApi.updateTimeSlot(roomId, timeslotId, data),
		onSuccess: (_, { timeslotId, roomId }) => {
			// Invalidate both the list and specific timeslot
			queryClient.invalidateQueries({ queryKey: roomKeys.timeslots(roomId) });
			queryClient.invalidateQueries({ queryKey: roomKeys.timeslot(roomId, timeslotId) });
			enqueueSnackbar('Cập nhật khung giờ thành công', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};
