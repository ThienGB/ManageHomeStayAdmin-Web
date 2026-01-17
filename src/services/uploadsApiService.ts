import { ApiResponse } from '@/types';
import { mainApi } from '@/utils/api';

export type UploadFolder = 'ROOMS' | 'BLOGS';

export type UploadResponse = {
	url: string;
	publicId?: string;
	filename?: string;
};

export const uploadsApi = {
	/**
	 * Upload a single file to the specified folder
	 * @param file - The file to upload
	 * @param folder - The target folder ('ROOMS' | 'BLOGS')
	 * @returns Upload response with the file URL
	 */
	uploadFile: async (file: File, folder: UploadFolder): Promise<UploadResponse> => {
		const formData = new FormData();
		formData.append('file', file);

		const result = await mainApi
			.post('uploads', {
				body: formData,
				searchParams: { folder }
			})
			.json<ApiResponse<UploadResponse>>();

		return result.data;
	},

	/**
	 * Upload multiple files to the specified folder
	 * @param files - Array of files to upload
	 * @param folder - The target folder ('ROOMS' | 'BLOGS')
	 * @returns Array of upload responses
	 */
	uploadFiles: async (files: File[], folder: UploadFolder): Promise<UploadResponse[]> => {
		const uploadPromises = files.map((file) => uploadsApi.uploadFile(file, folder));
		return Promise.all(uploadPromises);
	},

	/**
	 * Delete an image by its URL
	 * @param url - The URL of the image to delete
	 */
	deleteImageByUrl: async (url: string): Promise<void> => {
		await mainApi.delete('uploads/by-url', {
			searchParams: { url }
		});
	},

	/**
	 * Delete multiple images by their URLs
	 * @param urls - Array of image URLs to delete
	 */
	deleteImagesByUrls: async (urls: string[]): Promise<void> => {
		const deletePromises = urls.map((url) => uploadsApi.deleteImageByUrl(url));
		await Promise.all(deletePromises);
	}
};
