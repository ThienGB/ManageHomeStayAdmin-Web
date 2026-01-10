export type AttractionLocation = {
	type: string;
	coordinates: [number, number]; // [longitude, latitude]
	address: string;
	city: string;
};

export type AttractionContact = {
	phone: string;
	email: string;
	website: string;
};

export type AttractionOperatingHour = {
	day: string;
	_id?: string;
	startDay?: string;
	endDay?: string;
	openTime: string;
	closeTime: string;
};

export type Partner = {
	name: string;
	email: string;
	id: string;
};

export type Attraction = {
	id: string;
	name: string;
	description: string;
	location: AttractionLocation;
	contact: AttractionContact;
	price: number;
	operatingHour: AttractionOperatingHour[];
	partnerId: string | Partner;
	images: string[];
	amenities: string[];
	status: string;
	averageRating: number;
	totalRatings: number;
	averageServiceRate: number;
	averageAttractionRate: number;
	averageRoomRate: number;
	averageFoodRate: number;
	registerDate: string;
	createdAt: string;
	updatedAt: string;
};

export type AttractionCategory = {
	id: string;
	name: string;
	slug: string;
	description?: string;
};
