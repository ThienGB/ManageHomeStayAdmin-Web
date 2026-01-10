import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleTypesApi } from '../services/ScheduleTypesAPIServices';
import { Pagination } from '@/types';
import { useSnackbar } from 'notistack';
import { getErrorMessage } from '@/utils/errorUtils';

type UseDeleteScheduleTypeOptions = {
	showToast?: boolean;
};

export const useDeleteScheduleType = (pagination?: Pagination, options: UseDeleteScheduleTypeOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (id: string) => scheduleTypesApi.deleteScheduleType(id),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['scheduleTypes', pagination] });

			if (showToast) {
				enqueueSnackbar(response.message || 'Schedule type deleted successfully', { variant: 'success' });
			}
		},
		onError: async (error) => {
			if (showToast) {
				const errorMessage = await getErrorMessage(error);
				enqueueSnackbar(errorMessage, { variant: 'error' });
			}
		}
	});
};
