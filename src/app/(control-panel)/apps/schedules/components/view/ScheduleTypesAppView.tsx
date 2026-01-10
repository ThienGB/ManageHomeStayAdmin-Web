import { ScheduleTypesAppContextProvider } from '../../context/schedule-types-context/ScheduleTypesAppContextProvider';
import ScheduleTypesHeader from '../ui/ScheduleTypesHeader';
import ScheduleTypesTable from '../ui/ScheduleTypesTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function ScheduleTypesAppView() {
	return (
		<Root
			header={<ScheduleTypesHeader />}
			content={<ScheduleTypesTable />}
		/>
	);
}

const ScheduleTypesWrapper = () => {
	return (
		<ScheduleTypesAppContextProvider>
			<ScheduleTypesAppView />
		</ScheduleTypesAppContextProvider>
	);
};

export default ScheduleTypesWrapper;
