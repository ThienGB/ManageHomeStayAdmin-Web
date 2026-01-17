import { useQuery } from '@tanstack/react-query';
import { timeslotsApi } from '../services/timeslotApiService';

export const timeslotQueryKey = (timeslotId: string) => ['timeslots', timeslotId];

export const useTimeSlot = (timeslotId: string) => {
	return useQuery({
		queryKey: timeslotQueryKey(timeslotId),
		queryFn: () => timeslotsApi.getTimeSlot(timeslotId),
		enabled: !!timeslotId
	});
};
