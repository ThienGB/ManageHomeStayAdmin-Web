import { bookingsApi, CreateBookingData } from '@/services/bookingsApiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateBooking = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateBookingData) => bookingsApi.createBooking(data),
		onSuccess: () => {
			// Invalidate availability queries to refetch and show updated status
			queryClient.invalidateQueries({ queryKey: ['timeSlotAvailability'] });
		}
	});
};
