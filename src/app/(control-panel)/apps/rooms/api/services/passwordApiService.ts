import { ApiResponse } from '@/types';
import { mainApi } from '@/utils/api';

export type PasswordResponse = ApiResponse<string>;

export const passwordApi = {
	/**
	 * Get current password for a room
	 * @param roomId - The room ID
	 */
	getCurrentPassword: async (roomId: string): Promise<string | null> => {
		try {
			const result = await mainApi.get(`rooms/${roomId}/current-password`).json<PasswordResponse>();
			return result.data;
		} catch (error) {
			// Return null if password doesn't exist yet
			return null;
		}
	},

	/**
	 * Create or update password for a room
	 * @param roomId - The room ID
	 * @param currentPassword - The new password to set
	 */
	setCurrentPassword: async (roomId: string, currentPassword: string): Promise<string> => {
		const result = await mainApi
			.put(`rooms/${roomId}/current-password`, { json: { currentPassword } })
			.json<PasswordResponse>();
		return result.data;
	}
};
