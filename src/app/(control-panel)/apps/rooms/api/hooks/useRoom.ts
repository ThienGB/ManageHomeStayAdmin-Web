import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '../services/roomsApiService';

export const roomQueryKey = (roomId: string) => ['rooms', roomId];

export const useRoom = (roomId: string) => {
	return useQuery({
		queryKey: roomQueryKey(roomId),
		queryFn: () => roomsApi.getRoom(roomId),
		enabled: Boolean(roomId)
	});
};
