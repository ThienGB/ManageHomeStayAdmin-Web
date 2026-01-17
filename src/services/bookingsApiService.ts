import { ApiResponse } from '@/types';
import { mainApi } from '@/utils/api';

export type CreateBookingData = {
	roomId: string;
	timeSlotId: string;
	date: string;
};

export type Booking = {
	id: string;
	roomId: string;
	timeSlotId: string;
	date: string;
	createdAt?: string;
	updatedAt?: string;
};

export const bookingsApi = {
	createBooking: async (data: CreateBookingData): Promise<Booking> => {
		const result = await mainApi
			.post('bookings', { json: data })
			.json<ApiResponse<Booking>>();
		return result.data;
	}
};
