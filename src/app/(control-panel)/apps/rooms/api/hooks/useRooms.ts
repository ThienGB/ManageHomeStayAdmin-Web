import { useQuery } from '@tanstack/react-query';
import { GetRoomsParams, roomsApi } from '../services/roomsApiService';
import { roomKeys } from './queryKeys';

export const useRooms = (params: GetRoomsParams) => {
	return useQuery({
		queryKey: roomKeys.list(params),
		queryFn: () => roomsApi.getRooms(params)
	});
};
