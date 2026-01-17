import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { TimeSlot } from '../types';

const TimeSlotModel = (data: PartialDeep<TimeSlot>) =>
	_.defaults(data ||{}, {
		id: _.uniqueId('timeSlot-'),
		openTime: "08:00",
		closeTime: "09:00",
		price: 0,
		isOvernight: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

export default TimeSlotModel;