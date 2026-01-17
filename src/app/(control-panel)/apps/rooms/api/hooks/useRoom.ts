import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '../services/roomsApiService';
import { roomKeys } from './queryKeys';

export const useRoom = (roomId: string) => {
	return useQuery({
		queryKey: roomKeys.detail(roomId),
		queryFn: () => roomsApi.getRoom(roomId),
		enabled: Boolean(roomId) && roomId !== 'new' && roomId !== 'add'
	});
};
