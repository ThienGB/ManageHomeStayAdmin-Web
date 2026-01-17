/**
 * Centralized query keys for rooms feature
 * Following TanStack Query best practices with hierarchical keys
 *
 * Structure:
 * - ['rooms'] - All rooms queries
 * - ['rooms', 'list', params] - Rooms list with filters
 * - ['rooms', 'detail', roomId] - Single room detail
 * - ['rooms', 'detail', roomId, 'timeslots'] - Timeslots for a room
 * - ['rooms', 'detail', roomId, 'timeslots', timeslotId] - Single timeslot
 */
export const roomKeys = {
	// Base key for all room queries
	all: ['rooms'] as const,

	// Rooms list queries
	lists: () => [...roomKeys.all, 'list'] as const,
	list: (params?: Record<string, unknown>) => [...roomKeys.lists(), params] as const,

	// Single room queries
	details: () => [...roomKeys.all, 'detail'] as const,
	detail: (roomId: string) => [...roomKeys.details(), roomId] as const,

	// Timeslots nested under room
	timeslots: (roomId: string) => [...roomKeys.detail(roomId), 'timeslots'] as const,
	timeslot: (roomId: string, timeslotId: string) => [...roomKeys.timeslots(roomId), timeslotId] as const
};

/**
 * Centralized query keys for amenities
 */
export const amenityKeys = {
	all: ['amenities'] as const,
	list: (search?: string) => [...amenityKeys.all, 'list', search] as const
};
