import { getErrorMessage } from '@/utils/errorUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { timeslotsApi } from '../services/timeslotApiService';
import { TimeSlot } from '../types';
import { roomKeys } from './queryKeys';

export const useCreateTimeSlot = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ roomId, data }: { roomId: string; data: Partial<TimeSlot> }) =>
			timeslotsApi.createTimeSlot(roomId, data),
		onSuccess: (_, { roomId }) => {
			// Invalidate timeslots list for this room
			queryClient.invalidateQueries({ queryKey: roomKeys.timeslots(roomId) });
			enqueueSnackbar('Thêm khung giờ thành công', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};
