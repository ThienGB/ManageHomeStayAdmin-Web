import { useMutation, useQueryClient } from '@tanstack/react-query';
import { passwordApi } from '../services/passwordApiService';

export const useSetRoomPassword = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roomId, password }: { roomId: string; password: string }) =>
			passwordApi.setCurrentPassword(roomId, password),
		onSuccess: (_, variables) => {
			// Invalidate and refetch room password query
			queryClient.invalidateQueries({ queryKey: ['room-password', variables.roomId] });
		}
	});
};
