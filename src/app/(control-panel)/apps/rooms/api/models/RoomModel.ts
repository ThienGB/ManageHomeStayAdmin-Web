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
		capacity: 0,
		bed: 0,
		area: 0,
		images: [],
		isActive: true,
		amenities: [],
		hourlyRate: 0,
		overnightRate: 0
	});

export default RoomModel;
