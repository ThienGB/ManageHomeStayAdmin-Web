'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useRooms } from '../../api/hooks/useRooms';
import { RoomsAppContextProvider } from '../../context/rooms-context/RoomsAppContextProvider';
import { useRoomsAppContext } from '../../context/rooms-context/useRoomsAppContext';
import RoomsHeader from '../ui/RoomsHeader';
import RoomsTable from '../ui/RoomsTable';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '95%!important'
	}
}));

function RoomsAppView() {
	const { pagination, filters } = useRoomsAppContext();
	const [searchTerm, setSearchTerm] = useState('');

	const { data, isLoading } = useRooms({
		...pagination,
		...filters
	});

	const totalResults = data?.data?.totalElements;

	return (
		<Root
			header={
				<RoomsHeader
					totalResults={totalResults}
					isLoading={isLoading}
					onSearchChange={setSearchTerm}
				/>
			}
			content={<RoomsTable searchTerm={searchTerm} />}
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
