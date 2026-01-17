export type RoomImage = {
	id: string;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
	url: string;
};

export type RoomAmenity = {
	id: string;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
	name: string;
	icon?: string;
	description?: string;
};

export type Room = {
	id: string;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
	name: string;
	description?: string;
	capacity?: number;
	bed?: number;
	area?: number;
	images?: RoomImage[];
	isActive?: boolean;
	amenities?: RoomAmenity[];
	hourlyRate?: number;
	overnightRate?: number;
};

export type RoomCategory = {
	id: string;
	name: string;
	slug?: string;
	description?: string;
};

export type TimeSlot = {
	id: string;
	roomId?: string;
	startTime?: string;
	endTime?: string;
	price?: number;
	isOvernight?: boolean;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
};

// Availability response types
export type TimeSlotAvailabilityItem = {
	timeSlot: TimeSlot;
	isActive: boolean;
};

export type TimeSlotAvailabilityDate = {
	date: string;
	timeSlots: TimeSlotAvailabilityItem[];
};

// Backwards compatibility aliases
export type Attraction = Room;
export type AttractionCategory = RoomCategory;
