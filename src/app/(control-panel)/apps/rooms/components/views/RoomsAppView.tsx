'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import { useRooms } from '../../api/hooks/useRooms';
import { RoomsAppContextProvider } from '../../context/rooms-context/RoomsAppContextProvider';
import { useRoomsAppContext } from '../../context/rooms-context/useRoomsAppContext';
import RoomsHeader from '../ui/RoomsHeader';
import RoomsTable from '../ui/RoomsTable';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function RoomsAppView() {
	const { pagination, filters } = useRoomsAppContext();
    
	const { data, isLoading } = useRooms({
		...pagination,
		...filters
	});
    
	const totalResults = data?.data?.totalElements;

	return (
		<Root
			header={<RoomsHeader totalResults={totalResults} isLoading={isLoading} />}
			content={<RoomsTable />}
		/>
	);
}

const RoomsWrapper = () => {
	return (
		<RoomsAppContextProvider>
			<RoomsAppView />
		</RoomsAppContextProvider>
	);
};

export default RoomsWrapper;
