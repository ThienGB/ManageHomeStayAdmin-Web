import { UploadFolder, UploadResponse, uploadsApi } from '@/services/uploadsApiService';
import { getErrorMessage } from '@/utils/errorUtils';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

type UploadParams = {
	file: File;
	folder: UploadFolder;
};

type UploadMultipleParams = {
	files: File[];
	folder: UploadFolder;
};

/**
 * Hook for uploading a single file
 */
export const useUpload = () => {
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ file, folder }: UploadParams) => uploadsApi.uploadFile(file, folder),
		onSuccess: () => {
			enqueueSnackbar('File uploaded successfully', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};

/**
 * Hook for uploading multiple files
 */
export const useUploadMultiple = () => {
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ files, folder }: UploadMultipleParams) => uploadsApi.uploadFiles(files, folder),
		onSuccess: (data: UploadResponse[]) => {
			enqueueSnackbar(`${data.length} file(s) uploaded successfully`, { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};

/**
 * Hook for deleting a single image by URL
 */
export const useDeleteImage = () => {
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (url: string) => uploadsApi.deleteImageByUrl(url),
		onSuccess: () => {
			enqueueSnackbar('Image deleted successfully', { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};

/**
 * Hook for deleting multiple images by URLs
 */
export const useDeleteImages = () => {
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (urls: string[]) => uploadsApi.deleteImagesByUrls(urls),
		onSuccess: (_data, urls) => {
			enqueueSnackbar(`${urls.length} image(s) deleted successfully`, { variant: 'success' });
		},
		onError: async (error: unknown) => {
			const errorMessage = await getErrorMessage(error);
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
};
