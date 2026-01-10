import { useContext } from 'react';
import { ScheduleTypesAppContext } from './ScheduleTypesAppContext';

export const useScheduleTypesContext = () => {
	return useContext(ScheduleTypesAppContext);
};
