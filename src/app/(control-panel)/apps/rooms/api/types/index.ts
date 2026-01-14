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

// Backwards compatibility aliases
export type Attraction = Room;
export type AttractionCategory = RoomCategory;
