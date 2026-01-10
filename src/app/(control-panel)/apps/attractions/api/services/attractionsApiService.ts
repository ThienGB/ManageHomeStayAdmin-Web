import { api, mainApi } from '@/utils/api';
import { Attraction, AttractionCategory } from '../types';
import { ApiResponse, Pagination, StrictApiResponse } from '@/types';

export type AttractionListResponse = StrictApiResponse<Attraction, true>;
export type AttractionDetailResponse = StrictApiResponse<Attraction, false>;

export type GetAttractionsParams = Pagination & {
	search?: string;
	city?: string;
	amenityIds?: string[];
	amenityCategoryId?: string;
	rating?: number;
	status?: string;
	minPrice?: number;
	maxPrice?: number;
};

export const attractionsApi = {
	getAttractions: async (params: GetAttractionsParams): Promise<StrictApiResponse<Attraction, true>> => {
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

		const result = mainApi.get('attractions', { searchParams: cleanParams }).json();
		return result as Promise<StrictApiResponse<Attraction, true>>;
	},

	getAttraction: async (attractionId: string): Promise<Attraction> => {
		const result = await mainApi.get(`attractions/${attractionId}`).json<ApiResponse<Attraction>>();
		return result.data;
	},

	createAttraction: async (data: Partial<Attraction>): Promise<Attraction> => {
		const result = await mainApi.post('attractions', { json: data }).json<ApiResponse<Attraction>>();
		return result.data;
	},

	updateAttraction: async (attractionId: string, data: Partial<Attraction>): Promise<Attraction> => {
		const result = await mainApi.put(`attractions/${attractionId}`, { json: data }).json<ApiResponse<Attraction>>();
		return result.data;
	},

	deleteAttraction: async (attractionId: string): Promise<void> => {
		await mainApi.delete(`attractions/${attractionId}`);
	},

	deleteAttractions: async (attractionIds: string[]): Promise<void> => {
		await api.delete('mock/attractions', { json: attractionIds });
	},

	getCategories: async (): Promise<AttractionCategory[]> => {
		return api.get('mock/attraction-categories').json();
	}
};
