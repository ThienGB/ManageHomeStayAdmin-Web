import { useContext } from 'react';
import { RoomsAppContext } from './RoomsAppContext';

export const useRoomsAppContext = () => {
	const context = useContext(RoomsAppContext);
	if (!context) {
		throw new Error('useRoomsAppContext must be used within RoomsAppContextProvider');
	}
	return context;
};
