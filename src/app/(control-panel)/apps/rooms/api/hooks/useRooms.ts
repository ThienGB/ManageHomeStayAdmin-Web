import { useQuery } from '@tanstack/react-query';
import { GetRoomsParams, roomsApi } from '../services/roomsApiService';

export const roomsQueryKey = (params: GetRoomsParams) => ['rooms', params];

export const useRooms = (params: GetRoomsParams) => {
	return useQuery({
		queryKey: roomsQueryKey(params),
		queryFn: () => roomsApi.getRooms(params)
	});
};
