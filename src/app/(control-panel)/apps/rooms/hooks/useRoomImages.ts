'use client';

import { uploadsApi } from '@/services/uploadsApiService';
import { getErrorMessage } from '@/utils/errorUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { roomKeys } from '../api/hooks/queryKeys';
import { roomsApi } from '../api/services/roomsApiService';
import { RoomImage } from '../api/types';

export type FormImage = {
	id?: string;
	url: string;
	isLocal?: boolean;
	file?: File;
};

type ImageOperationResult = {
	success: boolean;
	url?: string;
	error?: string;
};

type ImageSyncResult = {
	uploaded: ImageOperationResult[];
	added: ImageOperationResult[];
	deleted: ImageOperationResult[];
	hasErrors: boolean;
};

/**
 * Custom hook for managing room images with granular error handling
 */
export function useRoomImages(roomId: string) {
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();
	const [syncStatus, setSyncStatus] = useState<string>('');
	const [isSyncing, setIsSyncing] = useState(false);

	/**
	 * Upload a single image and return result
	 */
	const uploadSingleImage = async (file: File): Promise<ImageOperationResult> => {
		try {
			const result = await uploadsApi.uploadFile(file, 'ROOMS');
			return { success: true, url: result.url };
		} catch (error) {
			const errorMessage = await getErrorMessage(error);
			return {
				success: false,
				error: errorMessage
			};
		}
	};

	/**
	 * Add images to room and return result
	 */
	const addImagesToRoom = async (urls: string[]): Promise<ImageOperationResult[]> => {
		if (urls.length === 0) return [];

		try {
			await roomsApi.addRoomImages(roomId, urls);
			return urls.map((url) => ({ success: true, url }));
		} catch (error) {
			const errorMessage = await getErrorMessage(error);
			return urls.map((url) => ({
				success: false,
				url,
				error: errorMessage
			}));
		}
	};

	/**
	 * Delete a single image from room and storage
	 */
	const deleteSingleImage = async (image: RoomImage): Promise<ImageOperationResult> => {
		try {
			// Delete from room first
			await roomsApi.deleteRoomImage(roomId, image.id);
			// Then delete from storage (don't fail if this fails)
			try {
				await uploadsApi.deleteImageByUrl(image.url);
			} catch {
				// Storage deletion is non-critical
			}
			return { success: true, url: image.url };
		} catch (error) {
			const errorMessage = await getErrorMessage(error);
			return {
				success: false,
				url: image.url,
				error: errorMessage
			};
		}
	};

	/**
	 * Sync all image changes (upload new, add to room, delete removed)
	 * Uses Promise.allSettled for granular error handling
	 */
	const syncImages = useCallback(
		async (currentImages: FormImage[], originalImages: RoomImage[]): Promise<ImageSyncResult> => {
			setIsSyncing(true);
			const result: ImageSyncResult = {
				uploaded: [],
				added: [],
				deleted: [],
				hasErrors: false
			};

			try {
				// Step 1: Find new images to upload
				const newImages = currentImages.filter((img) => img.isLocal && img.file);
				const existingImageIds = new Set(
					currentImages.filter((img) => !img.isLocal && img.id).map((img) => img.id)
				);
				const removedImages = originalImages.filter((img) => !existingImageIds.has(img.id));

				// Step 2: Upload new images in parallel with allSettled
				if (newImages.length > 0) {
					setSyncStatus(`Uploading ${newImages.length} image(s)...`);
					const uploadPromises = newImages.map((img) => uploadSingleImage(img.file!));
					const uploadResults = await Promise.allSettled(uploadPromises);

					result.uploaded = uploadResults.map((res, index) => {
						if (res.status === 'fulfilled') {
							return res.value;
						}

						return {
							success: false,
							error: res.reason?.message || 'Upload failed'
						};
					});

					// Get successfully uploaded URLs
					const uploadedUrls = result.uploaded.filter((r) => r.success && r.url).map((r) => r.url!);

					// Step 3: Add uploaded images to room
					if (uploadedUrls.length > 0) {
						setSyncStatus(`Adding ${uploadedUrls.length} image(s) to room...`);
						result.added = await addImagesToRoom(uploadedUrls);
					}

					// Check for upload errors
					const uploadErrors = result.uploaded.filter((r) => !r.success);

					if (uploadErrors.length > 0) {
						result.hasErrors = true;
						enqueueSnackbar(`${uploadErrors.length} image(s) failed to upload`, { variant: 'warning' });
					}
				}

				// Step 4: Delete removed images in parallel
				if (removedImages.length > 0) {
					setSyncStatus(`Deleting ${removedImages.length} image(s)...`);
					const deletePromises = removedImages.map((img) => deleteSingleImage(img));
					const deleteResults = await Promise.allSettled(deletePromises);

					result.deleted = deleteResults.map((res) => {
						if (res.status === 'fulfilled') {
							return res.value;
						}

						return {
							success: false,
							error: res.reason?.message || 'Delete failed'
						};
					});

					// Check for delete errors
					const deleteErrors = result.deleted.filter((r) => !r.success);

					if (deleteErrors.length > 0) {
						result.hasErrors = true;
						enqueueSnackbar(`${deleteErrors.length} image(s) failed to delete`, { variant: 'warning' });
					}
				}

				// Invalidate room query to refresh data
				queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });

				// Summary notification
				const uploadedCount = result.uploaded.filter((r) => r.success).length;
				const deletedCount = result.deleted.filter((r) => r.success).length;

				if (uploadedCount > 0 || deletedCount > 0) {
					const messages: string[] = [];

					if (uploadedCount > 0) messages.push(`${uploadedCount} added`);

					if (deletedCount > 0) messages.push(`${deletedCount} removed`);

					enqueueSnackbar(`Images: ${messages.join(', ')}`, { variant: 'success' });
				}

				setSyncStatus('');
				return result;
			} catch (error) {
				console.error('Error syncing images:', error);
				result.hasErrors = true;
				const errorMessage = await getErrorMessage(error);
				enqueueSnackbar(errorMessage, { variant: 'error' });
				return result;
			} finally {
				setIsSyncing(false);
				setSyncStatus('');
			}
		},
		[roomId, queryClient, enqueueSnackbar]
	);

	/**
	 * Rollback uploaded images (used when room creation fails)
	 */
	const rollbackUploadedImages = useCallback(async (urls: string[]): Promise<void> => {
		if (urls.length === 0) return;

		setSyncStatus('Rolling back uploaded images...');
		setIsSyncing(true);

		try {
			const deletePromises = urls.map((url) =>
				uploadsApi.deleteImageByUrl(url).catch(() => {
					// Ignore individual failures
				})
			);
			await Promise.allSettled(deletePromises);
		} catch (error) {
			console.error('Failed to rollback images:', error);
		} finally {
			setIsSyncing(false);
			setSyncStatus('');
		}
	}, []);

	return {
		syncImages,
		rollbackUploadedImages,
		isSyncing,
		syncStatus
	};
}

export default useRoomImages;
