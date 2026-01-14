import { api , mainApi} from '@/utils/api';
import { Amenity, AmenityCategory } from '../types';
import { ApiResponse, Pagination, StrictApiResponse } from '@/types';

export type AmenityListResponse = StrictApiResponse<Amenity, true>;
// Dùng khi gọi detail (không phân trang):
export type AmenityDetailResponse = StrictApiResponse<Amenity, false>;



export const amenitiesApi = {
	
	getAmenities: async (): Promise<Amenity[]> => {
		const result = await mainApi.get('amenities').json<ApiResponse<Amenity[]>>();
		return result.data;
	},

	getAmenity: async (id: string): Promise<Amenity> => {
		const result = await mainApi.get(`amenities/${id}`).json<ApiResponse<Amenity>>();
		return result.data;
	},

	createAmenity: async (amenity: Partial<Amenity>): Promise<Amenity> => {
		const result = await mainApi.post('amenities', { json: amenity }).json<ApiResponse<Amenity>>();
		return result.data;
	},

	updateAmenity: async (amenity: Amenity): Promise<Amenity> => {
		const result = await mainApi.put(`amenities/${amenity.id}`, { json: amenity }).json<ApiResponse<Amenity>>();
		return result.data;
	},

	deleteAmenity: async (id: string): Promise<void> => {
		await mainApi.delete(`amenities/${id}`);
	},

	deleteAmenities: async (ids: string[]): Promise<void> => {
		await api.delete('mock/amenities', { json: ids });
	},

	getCategories: async (pagination:Pagination , search?: string): Promise<StrictApiResponse<AmenityCategory, true>> => {
		const result = mainApi.get('amenityCategories', { searchParams: { ...pagination, search } }).json();
		return result as Promise<StrictApiResponse<AmenityCategory, true>>
	},

	getCategory: async (id: string): Promise<AmenityCategory> => {
		return api.get(`mock/amenity-categories/${id}`).json();
	},

	createCategory: async (category: Partial<AmenityCategory>): Promise<AmenityCategory> => {
		return mainApi.post('amenityCategories', { json: category }).json();
	},

	updateCategory: async (category: AmenityCategory): Promise<AmenityCategory> => {
		return mainApi.put(`amenityCategories/${category.id}`, { json: category }).json();
	},

	deleteCategory: async (id: string): Promise<void> => {
		await mainApi.delete(`amenityCategories/${id}`);
	},

	deleteCategories: async (ids: string[]): Promise<void> => {
		await api.delete('mock/amenity-categories', { json: ids });
	},
};
