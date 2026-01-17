import { useQuery } from '@tanstack/react-query';
import { timeslotsApi } from '../services/timeslotApiService';

export const timeslotsQueryKey = (roomId: string) => ['rooms', roomId, 'timeslots'];

export const useTimeSlots = (roomId: string) => {
	return useQuery({
		queryKey: timeslotsQueryKey(roomId),
		queryFn: () => timeslotsApi.getTimeSlots(roomId),
		enabled: !!roomId && roomId.toLowerCase() !== 'new'
	});
};
