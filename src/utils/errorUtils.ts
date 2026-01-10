import { HTTPError } from 'ky';
import { ApiResponse } from '@/types';

/**
 * Extract error message from error object
 * Handles HTTPError from ky and extracts message from ApiResponse format
 */
export const getErrorMessage = async (error: unknown): Promise<string> => {
	if (error instanceof HTTPError) {
		try {
			const errorBody = (await error.response.json()) as Partial<ApiResponse<unknown>>;

			if (errorBody.message && typeof errorBody.message === 'string') {
				return errorBody.message;
			}
		} catch {
			return error.response.statusText || `HTTP ${error.response.status}`;
		}
	}

	if (error instanceof Error) {
		return error.message;
	}

	return 'An unexpected error occurred';
};
