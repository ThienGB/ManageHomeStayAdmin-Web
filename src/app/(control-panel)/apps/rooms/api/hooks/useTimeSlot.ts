import { useQuery } from '@tanstack/react-query';
import { timeslotsApi } from '../services/timeslotApiService';
import { roomKeys } from './queryKeys';

export const useTimeSlot = (roomId: string, timeslotId: string) => {
	return useQuery({
		queryKey: roomKeys.timeslot(roomId, timeslotId),
		queryFn: () => timeslotsApi.getTimeSlot(timeslotId),
		enabled: !!roomId && !!timeslotId
	});
};
