import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { timeslotsApi } from '../services/timeslotApiService';
import { TimeSlot } from '../types';
import { timeslotsQueryKey } from './useTimeSlots';

export const useCreateTimeSlot = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ roomId, data }: { roomId: string; data: Partial<TimeSlot> }) =>
			timeslotsApi.createTimeSlot(roomId, data),
		onSuccess: (_, { roomId }) => {
			queryClient.invalidateQueries({ queryKey: timeslotsQueryKey(roomId) });
			enqueueSnackbar('Time slot created successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error creating time slot', { variant: 'error' });
		}
	});
};
