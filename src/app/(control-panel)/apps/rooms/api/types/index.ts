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
	openTime?: string;
	closeTime?: string;
	isOvernight?: boolean;
	createdAt?: string;
	updatedAt?: string;
};

// Backwards compatibility aliases
export type Attraction = Room;
export type AttractionCategory = RoomCategory;
