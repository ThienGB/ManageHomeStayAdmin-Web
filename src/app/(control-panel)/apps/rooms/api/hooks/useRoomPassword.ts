import { useQuery } from '@tanstack/react-query';
import { passwordApi } from '../services/passwordApiService';

export const useRoomPassword = (roomId: string) => {
	return useQuery({
		queryKey: ['room-password', roomId],
		queryFn: () => passwordApi.getCurrentPassword(roomId),
		enabled: !!roomId
	});
};
