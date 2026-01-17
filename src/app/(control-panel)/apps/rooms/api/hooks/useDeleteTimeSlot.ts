import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { timeslotsApi } from '../services/timeslotApiService';
import { timeslotsQueryKey } from './useTimeSlots';

export const useDeleteTimeSlot = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ timeslotId, roomId }: { timeslotId: string; roomId: string }) =>
			timeslotsApi.deleteTimeSlot(roomId, timeslotId),
		onSuccess: (_, { roomId }) => {
			queryClient.invalidateQueries({ queryKey: timeslotsQueryKey(roomId) });
			enqueueSnackbar('Time slot deleted successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error deleting time slot', { variant: 'error' });
		}
	});
};
