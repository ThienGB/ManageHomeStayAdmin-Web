import { useMutation, useQueryClient } from "@tanstack/react-query";
import { amenitiesApi } from "../services/amenitiesApiService";
import { amenitiesQueryKey } from "./useAmenities";

export const useDeleteAmenities = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (ids: string[]) => amenitiesApi.deleteAmenities(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: amenitiesQueryKey() });
		},
		onError: () => {},
	});
};
