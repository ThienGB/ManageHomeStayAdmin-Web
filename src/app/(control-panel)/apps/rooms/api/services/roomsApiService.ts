import { ApiResponse, Pagination, StrictApiResponse } from '@/types';
import { mainApi } from '@/utils/api';
import { Room } from '../types';

export type RoomListResponse = StrictApiResponse<Room, true>;
export type RoomDetailResponse = StrictApiResponse<Room, false>;

export type GetRoomsParams = Pagination & {
	search?: string;
	city?: string;
	amenityIds?: string[];
	amenityCategoryId?: string;
	rating?: number;
	status?: string;
	minPrice?: number;
	maxPrice?: number;
};

export const roomsApi = {
	getRooms: async (params: GetRoomsParams): Promise<StrictApiResponse<Room, true>> => {
		// Remove undefined, null, and empty string/array values from params
		const cleanParams: Record<string, string | number> = {};

		Object.entries(params).forEach(([key, value]) => {
			// Skip undefined, null, empty strings
			if (value === undefined || value === null || value === '') {
				return;
			}

			// Skip empty arrays
			if (Array.isArray(value) && value.length === 0) {
				return;
			}

			// Convert array to comma-separated string for amenityIds
			if (key === 'amenityIds' && Array.isArray(value)) {
				cleanParams[key] = value.join(',');
			} else if (typeof value === 'string' || typeof value === 'number') {
				cleanParams[key] = value;
			}
		});

		const result = mainApi.get('rooms').json();
		return result as Promise<StrictApiResponse<Room, true>>;
	},

	getRoom: async (roomId: string): Promise<Room> => {
		const result = await mainApi.get(`rooms/${roomId}`).json<ApiResponse<Room>>();
		return result.data;
	},

	createRoom: async (data: Partial<Room>): Promise<Room> => {
		const result = await mainApi.post('rooms', { json: data }).json<ApiResponse<Room>>();
		return result.data;
	},

	updateRoom: async (roomId: string, data: Partial<Room>): Promise<Room> => {
		const result = await mainApi.put(`rooms/${roomId}`, { json: data }).json<ApiResponse<Room>>();
		return result.data;
	},

	deleteRoom: async (roomId: string): Promise<void> => {
		await mainApi.delete(`rooms/${roomId}`);
	},

	/**
	 * Add images to a room
	 * @param roomId - The room ID
	 * @param urls - Array of image URLs to add
	 */
	addRoomImages: async (roomId: string, urls: string[]): Promise<void> => {
		await mainApi.post(`rooms/${roomId}/images`, { json: { urls } });
	},

	/**
	 * Delete an image from a room
	 * @param roomId - The room ID
	 * @param imageId - The image ID to delete
	 */
	deleteRoomImage: async (roomId: string, imageId: string): Promise<void> => {
		await mainApi.delete(`rooms/${roomId}/images/${imageId}`);
	}
};
