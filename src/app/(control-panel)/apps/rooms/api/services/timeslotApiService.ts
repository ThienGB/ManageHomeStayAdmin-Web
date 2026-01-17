import { ApiResponse, StrictApiResponse } from '@/types';
import { mainApi } from '@/utils/api';
import { TimeSlot, TimeSlotAvailabilityDate, TimeSlotAvailabilityItem } from '../types';

export type TimeSlotListResponse = StrictApiResponse<TimeSlot, true>;
export type TimeSlotDetailResponse = StrictApiResponse<TimeSlot, false>;

export const timeslotsApi = {
	getTimeSlots: async (roomId: string): Promise<TimeSlot[]> => {
		const result = await mainApi
			.get(`rooms/${roomId}/time-slots`)
			.json<ApiResponse<TimeSlot[]>>();
		return result.data;
	},

	getTimeSlot: async (timeslotId: string): Promise<TimeSlot> => {
		const result = await mainApi
			.get(`timeslots/${timeslotId}`)
			.json<ApiResponse<TimeSlot>>();
		return result.data;
	},

	createTimeSlot: async (roomId: string, data: Partial<TimeSlot>): Promise<TimeSlot> => {
		const result = await mainApi
			.post(`rooms/${roomId}/time-slots`, { json: data })
			.json<ApiResponse<TimeSlot>>();
		return result.data;
	},

	updateTimeSlot: async (roomId: string, timeslotId: string, data: Partial<TimeSlot>): Promise<TimeSlot> => {
		const result = await mainApi
			.put(`rooms/${roomId}/time-slots/${timeslotId}`, { json: data })
			.json<ApiResponse<TimeSlot>>();
		return result.data;
	},

	deleteTimeSlot: async (roomId: string, timeslotId: string): Promise<void> => {
		await mainApi.delete(`rooms/${roomId}/time-slots/${timeslotId}`);
	},

	getTimeSlotAvailability: async (roomId: string, startDate: string, endDate: string): Promise<TimeSlot[]> => {
		const result = await mainApi
			.get(`rooms/${roomId}/time-slots/availability`, {
				searchParams: {
					startDate,
					endDate
				}
			})
			.json<ApiResponse<TimeSlotAvailabilityDate[]>>();
		
		// Extract time slots from the nested structure
		// The API returns an array of dates, each with timeSlots
		// We need to flatten this and extract only the active ones
		const availableSlots: TimeSlot[] = [];
		
		result.data.forEach((dateItem: TimeSlotAvailabilityDate) => {
			dateItem.timeSlots.forEach((item: TimeSlotAvailabilityItem) => {
				// Only include slots where isActive is true
				if (item.isActive) {
					availableSlots.push(item.timeSlot);
				}
			});
		});
		
		return availableSlots;
	}
};
