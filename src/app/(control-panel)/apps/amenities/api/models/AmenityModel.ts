import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Amenity } from '../types';

const AmenityModel = (data: PartialDeep<Amenity>) =>
	_.defaults(data || {}, {
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

export default AmenityModel;
