import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Room } from '../types';

const RoomModel = (data: PartialDeep<Room>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('room-'),
		isDeleted: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		name: '',
		description: '',
		capacity: 1,
		numberOfBeds: 1,
		area: 10,
		images: [],
		isActive: true,
		amenities: [],
		amenityIds: []
	});

export default RoomModel;
