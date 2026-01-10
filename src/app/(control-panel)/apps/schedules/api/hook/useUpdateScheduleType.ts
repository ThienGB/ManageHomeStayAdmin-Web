import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleTypesApi } from '../services/ScheduleTypesAPIServices';
import { ScheduleType } from '../types/ScheduleTypes';
import { Pagination } from '@/types';
import { useSnackbar } from 'notistack';
import { getErrorMessage } from '@/utils/errorUtils';

type UseUpdateScheduleTypeOptions = {
	showToast?: boolean;
};

export const useUpdateScheduleType = (pagination?: Pagination, options: UseUpdateScheduleTypeOptions = {}) => {
	const { showToast = true } = options;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (scheduleType: ScheduleType) => scheduleTypesApi.updateScheduleType(scheduleType),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['scheduleTypes', pagination] });

			if (showToast) {
				enqueueSnackbar(response.message || 'Schedule type updated successfully', { variant: 'success' });
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
