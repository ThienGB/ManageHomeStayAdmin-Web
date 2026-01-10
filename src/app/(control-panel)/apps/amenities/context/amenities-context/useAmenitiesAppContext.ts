import { useContext } from 'react';
import { AmenitiesAppContext } from './AmenitiesAppContext';

export const useAmenitiesAppContext = () => {
	return useContext(AmenitiesAppContext);
};
