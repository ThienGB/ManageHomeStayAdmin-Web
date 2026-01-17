import { useQuery } from '@tanstack/react-query';
import { timeslotsApi } from '../services/timeslotApiService';
import { roomKeys } from './queryKeys';

export const useTimeSlots = (roomId: string) => {
	return useQuery({
		queryKey: roomKeys.timeslots(roomId),
		queryFn: () => timeslotsApi.getTimeSlots(roomId),
		enabled: !!roomId && roomId.toLowerCase() !== 'new' && roomId.toLowerCase() !== 'add'
	});
};
