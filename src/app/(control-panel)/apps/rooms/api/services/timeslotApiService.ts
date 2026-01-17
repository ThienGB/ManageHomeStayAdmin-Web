import { ApiResponse, StrictApiResponse } from '@/types';
import { mainApi } from '@/utils/api';
import { TimeSlot } from '../types';

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
	}
};
