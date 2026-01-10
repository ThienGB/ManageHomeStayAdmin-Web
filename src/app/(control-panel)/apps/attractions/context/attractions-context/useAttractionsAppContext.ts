import { useContext } from 'react';
import { AttractionsAppContext } from './AttractionsAppContext';

export const useAttractionsAppContext = () => {
	const context = useContext(AttractionsAppContext);
	if (!context) {
		throw new Error('useAttractionsAppContext must be used within AttractionsAppContextProvider');
	}
	return context;
};
