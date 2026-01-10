export type Amenity = {
	id: string;
	name: string;
	categoryId: string | AmenityCategory;
	icon?: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
};

export type AmenityCategory = {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
};
