import { mainApi } from '@/utils/api';
import { ScheduleType } from '../types/ScheduleTypes';
import { Pagination, StrictApiResponse, ApiResponse } from '@/types';

export type ScheduleTypeListResponse = StrictApiResponse<ScheduleType, true>;

export const scheduleTypesApi = {
	getScheduleTypes: async (pagination: Pagination, search?: string): Promise<ScheduleTypeListResponse> => {
		const result = await mainApi.get('scheduleTypes', { searchParams: { ...pagination, search } }).json();
		return result as Promise<ScheduleTypeListResponse>;
	},

	createScheduleType: async (scheduleType: ScheduleType): Promise<ApiResponse<ScheduleType>> => {
		const formData = new FormData();
		Object.entries(scheduleType).forEach(([key, value]) => {
			formData.append(key, value as string | File);
		});
		const result = await mainApi
			.post('scheduleTypes', {
				body: formData
			})
			.json<ApiResponse<ScheduleType>>();
		return result;
	},

	updateScheduleType: async (scheduleType: ScheduleType): Promise<ApiResponse<ScheduleType>> => {
		const hasFile = Object.values(scheduleType).some((value) => value instanceof File);

		if (hasFile) {
			const formData = new FormData();
			Object.entries(scheduleType).forEach(([key, value]) => {
				if (value === undefined || value === null) {
					return;
				}

				formData.append(key, value as string | File);
			});
			const result = await mainApi
				.put(`scheduleTypes/${scheduleType.id}`, {
					body: formData
				})
				.json<ApiResponse<ScheduleType>>();
			return result;
		} else {
			const { createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = scheduleType;
			const result = await mainApi
				.put(`scheduleTypes/${scheduleType.id}`, {
					json: updateData
				})
				.json<ApiResponse<ScheduleType>>();
			return result;
		}
	},

	deleteScheduleType: async (id: string): Promise<ApiResponse<void>> => {
		try {
			const result = await mainApi.delete(`scheduleTypes/${id}`).json<ApiResponse<void>>();

			return result;
		} catch (error) {
			if (error instanceof Error && error.message.includes('JSON')) {
				return {
					success: true,
					data: undefined as void,
					message: 'Schedule type deleted successfully'
				};
			}

			throw error;
		}
	}
};
