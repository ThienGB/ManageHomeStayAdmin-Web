import { useQuery } from '@tanstack/react-query';
import { timeslotsApi } from '../services/timeslotApiService';

export const useTimeSlotAvailability = (roomId: string, selectedDate: Date | null) => {
	// Format date to YYYY-MM-DD
	const formatDate = (date: Date): string => {
		return date.toISOString().split('T')[0];
	};

	const dateString = selectedDate ? formatDate(selectedDate) : null;

	return useQuery({
		queryKey: ['timeSlotAvailability', roomId, dateString],
		queryFn: () => {
			if (!dateString) {
				return Promise.resolve([]);
			}
			// Use same date for both startDay and endDay since we're checking one day
			return timeslotsApi.getTimeSlotAvailability(roomId, dateString, dateString);
		},
		enabled: !!roomId && !!dateString,
		staleTime: 30000 // Cache for 30 seconds
	});
};
