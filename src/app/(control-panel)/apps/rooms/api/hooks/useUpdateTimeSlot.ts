import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { timeslotsApi } from '../services/timeslotApiService';
import { TimeSlot } from '../types';
import { timeslotQueryKey } from './useTimeSlot';
import { timeslotsQueryKey } from './useTimeSlots';

export const useUpdateTimeSlot = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ timeslotId, roomId, data }: { timeslotId: string; roomId: string; data: Partial<TimeSlot> }) =>
			timeslotsApi.updateTimeSlot(roomId, timeslotId, data),
		onSuccess: (_, { timeslotId, roomId }) => {
			queryClient.invalidateQueries({ queryKey: timeslotsQueryKey(roomId) });
			queryClient.invalidateQueries({ queryKey: timeslotQueryKey(timeslotId) });
			enqueueSnackbar('Time slot updated successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error updating time slot', { variant: 'error' });
		}
	});
};
