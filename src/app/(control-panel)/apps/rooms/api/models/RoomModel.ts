import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Attraction } from '../types';

const AttractionModel = (data: PartialDeep<Attraction>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('attraction-'),
		name: '',
		description: '',
		category: '',
		location: {
			city: '',
			state: '',
			country: '',
			latitude: 0,
			longitude: 0
		},
		rating: 0,
		reviewCount: 0,
		price: {
			amount: 0,
			currency: 'USD',
			type: 'per person'
		},
		images: [],
		openingHours: {
			monday: '9:00 AM - 5:00 PM',
			tuesday: '9:00 AM - 5:00 PM',
			wednesday: '9:00 AM - 5:00 PM',
			thursday: '9:00 AM - 5:00 PM',
			friday: '9:00 AM - 5:00 PM',
			saturday: '10:00 AM - 4:00 PM',
			sunday: 'Closed'
		},
		tags: [],
		amenities: [],
		featured: false,
		status: 'draft',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	});

export default AttractionModel;
