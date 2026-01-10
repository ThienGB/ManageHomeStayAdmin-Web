import { useContext } from 'react';
import { CategoriesAppContext } from './CategoriesAppContext';

export const useCategoriesAppContext = () => {
	return useContext(CategoriesAppContext);
};
